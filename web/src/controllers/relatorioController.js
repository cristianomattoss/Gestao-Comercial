import * as servico from "../services/relatorioService";

export const TIPOS_RELATORIO = [
  { valor: "VENDAS", nome: "Vendas detalhadas", usaPeriodo: true },
  { valor: "VENDAS_POR_FILIAL", nome: "Vendas por filial", usaPeriodo: true },
  { valor: "VENDAS_POR_CATEGORIA", nome: "Vendas por categoria", usaPeriodo: true },
  { valor: "MAIS_VENDIDOS", nome: "Produtos mais vendidos", usaPeriodo: true },
  { valor: "ESTOQUE", nome: "Estoque atual", usaPeriodo: false },
];

export const FORMATOS_EXPORTACAO = [
  { valor: "PDF", nome: "PDF" },
  { valor: "EXCEL", nome: "Excel" },
  { valor: "CSV", nome: "CSV" },
];

export function nomeDoTipo(tipo) {
  return TIPOS_RELATORIO.find((item) => item.valor === tipo)?.nome ?? tipo;
}

// A API valida tudo de novo em construir(); aqui só se evita enviar o que não se aplica.
export function gerarRelatorio(parametros) {
  const tipo = TIPOS_RELATORIO.find((item) => item.valor === parametros.tipo);

  return servico.gerarRelatorio({
    tipo: parametros.tipo || undefined,
    periodoInicio: tipo?.usaPeriodo ? parametros.periodoInicio : undefined,
    periodoFim: tipo?.usaPeriodo ? parametros.periodoFim : undefined,
    filialId: parametros.filialId || undefined,
    categoriaId: parametros.categoriaId || undefined,
    produtoId: parametros.produtoId || undefined,
  });
}

export const carregarRecentes = servico.listarRecentes;
export const exportar = servico.exportarRelatorio;
export const carregarProdutos = servico.listarProdutos;
