import { baixarArquivo, requisitar } from "./api";

export function gerarRelatorio(parametros) {
  return requisitar("/relatorios", { metodo: "POST", corpo: parametros });
}

export function listarRecentes() {
  return requisitar("/relatorios/recentes");
}

export function exportarRelatorio(id, formato) {
  return baixarArquivo(`/relatorios/${id}/exportar?formato=${formato}`);
}

export function listarProdutos() {
  return requisitar("/produtos");
}
