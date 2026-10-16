import { consultarEmpresa, salvarEmpresa } from "../services/empresaService";

export function carregarEmpresa() {
  return consultarEmpresa();
}

export function gravarEmpresa(dados) {
  const limpos = Object.fromEntries(
    Object.entries(dados).map(([campo, valor]) => [campo, valor.trim()]),
  );

  return salvarEmpresa(limpos);
}
