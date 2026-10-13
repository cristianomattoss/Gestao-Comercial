const moeda = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Texto de uma célula para formatos legíveis (CSV e PDF).
export function formatarValor(coluna, valor) {
  if (valor === null || valor === undefined) return "";
  if (coluna.tipo === "moeda") return `R$ ${moeda.format(valor)}`;

  return String(valor);
}

export function descreverFiltros(parametros, nomes = {}) {
  const partes = [];

  if (parametros.periodoInicio) {
    partes.push(`Período: ${parametros.periodoInicio} a ${parametros.periodoFim}`);
  }
  if (parametros.filialId) partes.push(`Filial: ${nomes.filial ?? parametros.filialId}`);
  if (parametros.categoriaId) partes.push(`Categoria: ${nomes.categoria ?? parametros.categoriaId}`);
  if (parametros.produtoId) partes.push(`Produto: ${nomes.produto ?? parametros.produtoId}`);

  return partes;
}
