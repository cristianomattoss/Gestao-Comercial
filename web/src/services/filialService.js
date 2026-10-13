import { requisitar } from "./api";

export function listarFiliais() {
  return requisitar("/filiais");
}

export function cadastrarFilial({ nome, cidade, gerente }) {
  return requisitar("/filiais", {
    metodo: "POST",
    corpo: { nome, cidade, gerente },
  });
}
