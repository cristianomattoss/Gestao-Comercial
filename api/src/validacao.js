import { badRequest, forbidden } from "./errors.js";

const MES = /^\d{4}-(0[1-9]|1[0-2])$/;

export function lerMes(valor) {
  if (typeof valor !== "string" || !MES.test(valor)) {
    throw badRequest("Informe o mês no formato AAAA-MM.");
  }

  return valor;
}

export function lerId(valor, campo = "id") {
  const numero = Number(valor);

  if (!Number.isInteger(numero) || numero <= 0) {
    throw badRequest(`Parâmetro ${campo} inválido.`);
  }

  return numero;
}

export function lerIdOpcional(valor, campo) {
  return valor === undefined || valor === "" ? undefined : lerId(valor, campo);
}

export function textoObrigatorio(valor, campo) {
  if (typeof valor !== "string" || valor.trim() === "") {
    throw badRequest(`O campo ${campo} é obrigatório.`);
  }

  return valor.trim();
}

// RN01/RN12: o gestor só enxerga a filial vinculada; o administrador, qualquer uma.
// Retorna o id da filial a consultar (undefined = todas, só para administrador).
export function resolverEscopoFilial(usuario, filialIdSolicitada) {
  if (usuario.perfil === "ADMIN") {
    return filialIdSolicitada;
  }

  if (
    filialIdSolicitada !== undefined &&
    filialIdSolicitada !== usuario.filialId
  ) {
    throw forbidden("O gestor só pode acessar a filial a que está vinculado.");
  }

  return usuario.filialId;
}
