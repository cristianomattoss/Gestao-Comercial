import ExcelJS from "exceljs";

const FORMATO = { moeda: '"R$" #,##0.00', inteiro: "0" };

export async function gerarExcel({ titulo, colunas, linhas, totais, filtros }) {
  const livro = new ExcelJS.Workbook();
  const planilha = livro.addWorksheet("Relatório");

  planilha.addRow([titulo]).font = { bold: true, size: 14 };
  if (filtros.length > 0) planilha.addRow([filtros.join(" | ")]);
  planilha.addRow([]);

  const cabecalho = planilha.addRow(colunas.map((c) => c.titulo));
  cabecalho.font = { bold: true };

  // Valores são gravados como dados (texto ou número), nunca como fórmula.
  for (const linha of linhas) {
    planilha.addRow(colunas.map((c) => linha[c.chave] ?? null));
  }

  if (colunas.some((c) => c.chave in totais)) {
    const total = planilha.addRow(
      colunas.map((c, i) => (c.chave in totais ? totais[c.chave] : i === 0 ? "Total" : null)),
    );
    total.font = { bold: true };
  }

  colunas.forEach((coluna, i) => {
    const alvo = planilha.getColumn(i + 1);
    alvo.width = Math.max(14, coluna.titulo.length + 4);
    if (FORMATO[coluna.tipo]) alvo.numFmt = FORMATO[coluna.tipo];
  });

  return {
    tipo: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    extensao: "xlsx",
    conteudo: Buffer.from(await livro.xlsx.writeBuffer()),
  };
}
