import PDFDocument from "pdfkit";
import { formatarValor } from "./formatacao.js";

const MARGEM = 40;
const ALTURA_LINHA = 18;

export function gerarPdf({ titulo, colunas, linhas, totais, filtros, geradoEm }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: MARGEM });
    const partes = [];

    doc.on("data", (parte) => partes.push(parte));
    doc.on("end", () =>
      resolve({
        tipo: "application/pdf",
        extensao: "pdf",
        conteudo: Buffer.concat(partes),
      }),
    );
    doc.on("error", reject);

    const largura = doc.page.width - MARGEM * 2;
    const larguraColuna = largura / colunas.length;

    function desenharLinha(valores, { negrito = false } = {}) {
      if (doc.y + ALTURA_LINHA > doc.page.height - MARGEM) doc.addPage();

      const y = doc.y;
      doc.font(negrito ? "Helvetica-Bold" : "Helvetica").fontSize(9);
      valores.forEach((valor, i) => {
        doc.text(valor, MARGEM + i * larguraColuna, y, {
          width: larguraColuna - 6,
          height: ALTURA_LINHA - 4,
          ellipsis: true,
          lineBreak: false,
        });
      });
      doc.y = y + ALTURA_LINHA;
    }

    doc.font("Helvetica-Bold").fontSize(16).text(titulo);
    doc.font("Helvetica").fontSize(9);
    if (filtros.length > 0) doc.text(filtros.join(" | "));
    doc.text(`Gerado em ${geradoEm.toLocaleString("pt-BR")}`);
    doc.moveDown();

    desenharLinha(colunas.map((c) => c.titulo), { negrito: true });
    for (const linha of linhas) {
      desenharLinha(colunas.map((c) => formatarValor(c, linha[c.chave])));
    }

    if (colunas.some((c) => c.chave in totais)) {
      desenharLinha(
        colunas.map((c, i) =>
          c.chave in totais ? formatarValor(c, totais[c.chave]) : i === 0 ? "Total" : "",
        ),
        { negrito: true },
      );
    }

    doc.end();
  });
}
