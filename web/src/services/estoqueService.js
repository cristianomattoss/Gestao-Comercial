import { requisitar } from "./api";

export function consultarEstoque({ filialId, categoriaId, situacao }) {
  const consulta = new URLSearchParams();

  if (filialId) consulta.set("filialId", filialId);
  if (categoriaId) consulta.set("categoriaId", categoriaId);
  if (situacao) consulta.set("situacao", situacao);

  return requisitar(`/estoque?${consulta.toString()}`);
}

export function listarCategorias() {
  return requisitar("/categorias");
}
