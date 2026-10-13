import { pool } from "../db.js";
import * as estoqueModel from "./estoqueModel.js";
import { TipoRelatorio } from "./relatorio.js";

// Somente leitura (RN02/RN11): os relatórios consultam, nunca alteram os registros de origem.
// Cada consulta devolve { colunas, linhas }; "soma" marca as colunas que entram nos totais.

const COLUNAS = {
  mes: { chave: "mes", titulo: "Mês", tipo: "texto" },
  filial: { chave: "filial", titulo: "Filial", tipo: "texto" },
  produto: { chave: "produto", titulo: "Produto", tipo: "texto" },
  categoria: { chave: "categoria", titulo: "Categoria", tipo: "texto" },
  quantidade: { chave: "quantidade", titulo: "Quantidade", tipo: "inteiro", soma: true },
  valorTotal: { chave: "valorTotal", titulo: "Valor total", tipo: "moeda", soma: true },
  totalVendas: { chave: "totalVendas", titulo: "Vendas", tipo: "inteiro", soma: true },
  produtosVendidos: { chave: "produtosVendidos", titulo: "Unidades", tipo: "inteiro", soma: true },
  faturamento: { chave: "faturamento", titulo: "Faturamento", tipo: "moeda", soma: true },
  ticketMedio: { chave: "ticketMedio", titulo: "Ticket médio", tipo: "moeda" },
};

// RN03/RN04: período e filial restringem todas as consultas de vendas.
const FILTRO_VENDAS = `v.mes BETWEEN $1 AND $2
  AND ($3::int IS NULL OR v.filial_id = $3)
  AND ($4::int IS NULL OR p.categoria_id = $4)
  AND ($5::int IS NULL OR v.produto_id = $5)`;

function argumentos(r) {
  return [
    r.periodoInicio,
    r.periodoFim,
    r.filialId ?? null,
    r.categoriaId ?? null,
    r.produtoId ?? null,
  ];
}

async function vendas(r) {
  const { rows } = await pool.query(
    `SELECT v.mes, f.nome AS filial, p.nome AS produto, c.nome AS categoria,
            v.quantidade, v.valor_total::float8 AS "valorTotal"
     FROM vendas v
     JOIN filiais f ON f.id = v.filial_id
     JOIN produtos p ON p.id = v.produto_id
     JOIN categorias c ON c.id = p.categoria_id
     WHERE ${FILTRO_VENDAS}
     ORDER BY v.mes, f.nome, p.nome, v.id`,
    argumentos(r),
  );

  return {
    colunas: [COLUNAS.mes, COLUNAS.filial, COLUNAS.produto, COLUNAS.categoria, COLUNAS.quantidade, COLUNAS.valorTotal],
    linhas: rows,
  };
}

// RN05/RN06: faturamento = soma das vendas; ticket médio = faturamento / nº de vendas.
async function vendasPorFilial(r) {
  const { rows } = await pool.query(
    `SELECT f.nome AS filial, COUNT(*)::int AS "totalVendas",
            SUM(v.quantidade)::int AS "produtosVendidos",
            SUM(v.valor_total)::float8 AS faturamento
     FROM vendas v
     JOIN filiais f ON f.id = v.filial_id
     JOIN produtos p ON p.id = v.produto_id
     WHERE ${FILTRO_VENDAS}
     GROUP BY f.id, f.nome
     ORDER BY faturamento DESC, f.nome`,
    argumentos(r),
  );

  return {
    colunas: [COLUNAS.filial, COLUNAS.totalVendas, COLUNAS.produtosVendidos, COLUNAS.faturamento, COLUNAS.ticketMedio],
    linhas: rows.map((l) => ({ ...l, ticketMedio: l.faturamento / l.totalVendas })),
  };
}

// RN10: desempenho por categoria a partir das vendas dos produtos.
async function vendasPorCategoria(r) {
  const { rows } = await pool.query(
    `SELECT c.nome AS categoria, SUM(v.quantidade)::int AS quantidade,
            SUM(v.valor_total)::float8 AS faturamento
     FROM vendas v
     JOIN produtos p ON p.id = v.produto_id
     JOIN categorias c ON c.id = p.categoria_id
     WHERE ${FILTRO_VENDAS}
     GROUP BY c.id, c.nome
     ORDER BY faturamento DESC, c.nome`,
    argumentos(r),
  );

  return {
    colunas: [COLUNAS.categoria, COLUNAS.quantidade, COLUNAS.faturamento],
    linhas: rows,
  };
}

// RN09: ranking por unidades vendidas.
async function maisVendidos(r) {
  const { rows } = await pool.query(
    `SELECT p.nome AS produto, c.nome AS categoria,
            SUM(v.quantidade)::int AS quantidade,
            SUM(v.valor_total)::float8 AS faturamento
     FROM vendas v
     JOIN produtos p ON p.id = v.produto_id
     JOIN categorias c ON c.id = p.categoria_id
     WHERE ${FILTRO_VENDAS}
     GROUP BY p.id, p.nome, c.nome
     ORDER BY quantidade DESC, p.nome`,
    argumentos(r),
  );

  return {
    colunas: [COLUNAS.produto, COLUNAS.categoria, COLUNAS.quantidade, COLUNAS.faturamento],
    linhas: rows,
  };
}

// Posição atual de estoque, classificada pelo padrão State (RN07).
async function estoque(r) {
  const itens = await estoqueModel.listar({
    filialId: r.filialId,
    categoriaId: r.categoriaId,
  });

  return {
    colunas: [
      COLUNAS.filial,
      COLUNAS.produto,
      COLUNAS.categoria,
      { chave: "quantidade", titulo: "Estoque atual", tipo: "inteiro" },
      { chave: "estoqueMinimo", titulo: "Estoque mínimo", tipo: "inteiro" },
      { chave: "situacao", titulo: "Situação", tipo: "texto" },
    ],
    linhas: itens
      .filter((i) => r.produtoId === undefined || i.produtoId === r.produtoId)
      .map((i) => ({
        filial: i.filial,
        produto: i.produto,
        categoria: i.categoria,
        quantidade: i.quantidade,
        estoqueMinimo: i.estoqueMinimo,
        situacao: i.situacao?.obterDescricao() ?? "Sem classificação",
      })),
  };
}

const CONSULTAS = {
  [TipoRelatorio.VENDAS]: vendas,
  [TipoRelatorio.VENDAS_POR_FILIAL]: vendasPorFilial,
  [TipoRelatorio.VENDAS_POR_CATEGORIA]: vendasPorCategoria,
  [TipoRelatorio.MAIS_VENDIDOS]: maisVendidos,
  [TipoRelatorio.ESTOQUE]: estoque,
};

export async function gerarDados(relatorio) {
  const { colunas, linhas } = await CONSULTAS[relatorio.tipo](relatorio);
  const totais = {};

  for (const coluna of colunas.filter((c) => c.soma)) {
    totais[coluna.chave] = linhas.reduce((soma, l) => soma + l[coluna.chave], 0);
  }

  return { colunas, linhas, totais };
}

export async function registrarHistorico(usuarioId, relatorio) {
  const { rows } = await pool.query(
    `INSERT INTO relatorios_historico (usuario_id, tipo, parametros)
     VALUES ($1, $2, $3)
     RETURNING id, tipo, parametros, criado_em AS "criadoEm"`,
    [usuarioId, relatorio.tipo, JSON.stringify(relatorio.parametros())],
  );

  return rows[0];
}

export async function listarRecentes(usuarioId, limite = 10) {
  const { rows } = await pool.query(
    `SELECT id, tipo, parametros, criado_em AS "criadoEm"
     FROM relatorios_historico
     WHERE usuario_id = $1
     ORDER BY criado_em DESC, id DESC
     LIMIT $2`,
    [usuarioId, limite],
  );

  return rows;
}

export async function buscarDoHistorico(id, usuarioId) {
  const { rows } = await pool.query(
    `SELECT id, tipo, parametros, criado_em AS "criadoEm"
     FROM relatorios_historico
     WHERE id = $1 AND usuario_id = $2`,
    [id, usuarioId],
  );

  return rows[0];
}

// Nomes dos filtros aplicados, para o cabeçalho dos arquivos exportados.
export async function nomesDosFiltros({ filialId, categoriaId, produtoId }) {
  const nome = async (tabela, id) => {
    if (id === undefined) return undefined;

    const { rows } = await pool.query(`SELECT nome FROM ${tabela} WHERE id = $1`, [id]);

    return rows[0]?.nome;
  };

  return {
    filial: await nome("filiais", filialId),
    categoria: await nome("categorias", categoriaId),
    produto: await nome("produtos", produtoId),
  };
}
