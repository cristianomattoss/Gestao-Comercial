import { requisitar } from "./api";

export function consultarEmpresa() {
  return requisitar("/empresa");
}

export function salvarEmpresa(dados) {
  return requisitar("/empresa", { metodo: "PUT", corpo: dados });
}
