import { consultarEstoque, listarCategorias } from "../services/estoqueService";

export function carregarEstoque(filtros) {
  return consultarEstoque(filtros);
}

export function carregarCategorias() {
  return listarCategorias();
}
