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

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_MINIMA = 6;

// UC03: e-mail válido, senha mínima, perfil conhecido e filial obrigatória para gestor.
export function lerDadosUsuario(body = {}) {
  const email = textoObrigatorio(body.email, "e-mail").toLowerCase();

  if (!EMAIL.test(email)) {
    throw badRequest("Informe um e-mail válido.");
  }

  if (typeof body.senha !== "string" || body.senha.length < SENHA_MINIMA) {
    throw badRequest(`A senha deve ter no mínimo ${SENHA_MINIMA} caracteres.`);
  }

  if (body.perfil !== "ADMIN" && body.perfil !== "GESTOR") {
    throw badRequest("Perfil inválido. Use ADMIN ou GESTOR.");
  }

  if (body.perfil === "GESTOR") {
    return {
      email,
      senha: body.senha,
      perfil: body.perfil,
      filialId: lerId(body.filialId, "filialId"),
    };
  }

  return { email, senha: body.senha, perfil: body.perfil, filialId: null };
}
