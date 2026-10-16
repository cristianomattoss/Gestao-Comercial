import { pool } from "../db.js";

// Somente leitura (RN02/RN11): os registros de origem nunca são alterados.

export async function listar({ mes, filialId, formaPagamento }) {
  const { rows } = await pool.query(
    `SELECT v.id, v.filial_id AS "filialId", f.nome AS filial,
            v.produto_id AS "produtoId", p.nome AS produto,
            c.id AS "categoriaId", c.nome AS categoria,
            v.quantidade, v.valor_total::float8 AS "valorTotal", v.mes,
            v.forma_pagamento AS "formaPagamento"
     FROM vendas v
     JOIN filiais f ON f.id = v.filial_id
     JOIN produtos p ON p.id = v.produto_id
     JOIN categorias c ON c.id = p.categoria_id
     WHERE v.mes = $1 AND ($2::int IS NULL OR v.filial_id = $2)
       AND ($3::text IS NULL OR v.forma_pagamento = $3)
     ORDER BY v.id`,
    [mes, filialId ?? null, formaPagamento ?? null],
  );

  return rows;
}

// RN05/RN06: faturamento = soma dos valores; ticket médio = faturamento / nº de vendas.
export async function indicadores({ mes, filialId, formaPagamento }) {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS "totalVendas",
            COALESCE(SUM(valor_total), 0)::float8 AS faturamento,
            COALESCE(SUM(quantidade), 0)::int AS "produtosVendidos"
     FROM vendas
     WHERE mes = $1 AND ($2::int IS NULL OR filial_id = $2)
       AND ($3::text IS NULL OR forma_pagamento = $3)`,
    [mes, filialId ?? null, formaPagamento ?? null],
  );

  return calcularTicket(rows[0]);
}

// RN09: ranking por unidades vendidas.
export async function maisVendidos({ mes, filialId, limite }) {
  const { rows } = await pool.query(
    `SELECT p.id AS "produtoId", p.nome AS produto, c.nome AS categoria,
            SUM(v.quantidade)::int AS quantidade,
            SUM(v.valor_total)::float8 AS faturamento
     FROM vendas v
     JOIN produtos p ON p.id = v.produto_id
     JOIN categorias c ON c.id = p.categoria_id
     WHERE v.mes = $1 AND ($2::int IS NULL OR v.filial_id = $2)
     GROUP BY p.id, p.nome, c.nome
     ORDER BY quantidade DESC, p.nome
     LIMIT $3`,
    [mes, filialId ?? null, limite],
  );

  return rows;
}

// RN10: desempenho por categoria a partir das vendas dos produtos.
export async function porCategoria({ mes, filialId }) {
  const { rows } = await pool.query(
    `SELECT c.id AS "categoriaId", c.nome AS categoria,
            SUM(v.quantidade)::int AS quantidade,
            SUM(v.valor_total)::float8 AS faturamento
     FROM vendas v
     JOIN produtos p ON p.id = v.produto_id
     JOIN categorias c ON c.id = p.categoria_id
     WHERE v.mes = $1 AND ($2::int IS NULL OR v.filial_id = $2)
     GROUP BY c.id, c.nome
     ORDER BY faturamento DESC`,
    [mes, filialId ?? null],
  );

  return rows;
}

// RN08: mesmos indicadores e mesmo período para todas as filiais; filial sem vendas vem zerada.
export async function porFilial({ mes, filialIds }) {
  const { rows } = await pool.query(
    `SELECT f.id AS "filialId", f.nome AS filial,
            COUNT(v.id)::int AS "totalVendas",
            COALESCE(SUM(v.valor_total), 0)::float8 AS faturamento,
            COALESCE(SUM(v.quantidade), 0)::int AS "produtosVendidos"
     FROM filiais f
     LEFT JOIN vendas v ON v.filial_id = f.id AND v.mes = $1
     WHERE ($2::int[] IS NULL OR f.id = ANY($2))
     GROUP BY f.id, f.nome
     ORDER BY f.nome`,
    [mes, filialIds ?? null],
  );

  return rows.map(calcularTicket);
}

function calcularTicket(indicadores) {
  const { totalVendas, faturamento } = indicadores;

  return {
    ...indicadores,
    ticketMedio: totalVendas > 0 ? faturamento / totalVendas : 0,
  };
}
