import * as usuarioModel from "../models/usuarioModel.js";
import { badRequest, conflict, notFound } from "../errors.js";
import { lerDadosUsuario, lerId } from "../validacao.js";

export async function listar(req, res) {
  res.json(await usuarioModel.listar());
}

// RF13 / UC03: o administrador cadastra usuários; e-mail único.
export async function criar(req, res) {
  const dados = lerDadosUsuario(req.body);

  try {
    res.status(201).json(await usuarioModel.criar(dados));
  } catch (err) {
    if (err.code === "23505") throw conflict("Já existe um usuário com este e-mail.");
    if (err.code === "23503") throw badRequest("Filial não encontrada.");

    throw err;
  }
}

// Ativa ou inativa o acesso sem apagar o usuário (UC01: usuário inativo não entra).
export async function alterarSituacao(req, res) {
  const id = lerId(req.params.id);

  if (typeof req.body?.ativo !== "boolean") {
    throw badRequest("Informe ativo como verdadeiro ou falso.");
  }

  if (id === req.usuario.id && !req.body.ativo) {
    throw badRequest("Você não pode inativar o próprio usuário.");
  }

  const usuario = await usuarioModel.definirAtivo(id, req.body.ativo);

  if (!usuario) throw notFound("Usuário não encontrado.");

  res.json(usuario);
}
