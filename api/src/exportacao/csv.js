// CSV com ";" e vírgula decimal (padrão do Excel em pt-BR) e BOM para os acentos.

function escapar(texto) {
  // Neutraliza fórmulas: células iniciadas por = + - @ seriam executadas pelo Excel.
  const seguro = /^[=+\-@]/.test(texto) ? `'${texto}` : texto;

  return /[";\r\n]/.test(seguro) ? `"${seguro.replaceAll('"', '""')}"` : seguro;
}

function celula(coluna, valor) {
  if (valor === null || valor === undefined) return "";
  if (coluna.tipo === "moeda") return valor.toFixed(2).replace(".", ",");
  if (coluna.tipo === "inteiro") return String(valor);

  return escapar(String(valor));
}

export function gerarCsv({ colunas, linhas, totais }) {
  const linhasCsv = [colunas.map((c) => escapar(c.titulo)).join(";")];

  for (const linha of linhas) {
    linhasCsv.push(colunas.map((c) => celula(c, linha[c.chave])).join(";"));
  }

  if (colunas.some((c) => c.chave in totais)) {
    linhasCsv.push(
      colunas
        .map((c, i) => (c.chave in totais ? celula(c, totais[c.chave]) : i === 0 ? "Total" : ""))
        .join(";"),
    );
  }

  return {
    tipo: "text/csv; charset=utf-8",
    extensao: "csv",
    conteudo: Buffer.from(`﻿${linhasCsv.join("\r\n")}\r\n`, "utf-8"),
  };
}
