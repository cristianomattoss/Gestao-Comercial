import { FormatoExportacao } from "../models/relatorio.js";
import { gerarCsv } from "./csv.js";
import { gerarExcel } from "./excel.js";
import { gerarPdf } from "./pdf.js";

const EXPORTADORES = {
  [FormatoExportacao.CSV]: gerarCsv,
  [FormatoExportacao.EXCEL]: gerarExcel,
  [FormatoExportacao.PDF]: gerarPdf,
};

export async function exportar(formato, conteudo) {
  return EXPORTADORES[formato](conteudo);
}
