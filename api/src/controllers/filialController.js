import * as filialModel from "../models/filialModel.js";
import { conflict, forbidden, notFound } from "../errors.js";
import { lerId, resolverEscopoFilial, textoObrigatorio } from "../validacao.js";

function lerDados(body = {}) {
  return {
    nome: textoObrigatorio(body.nome, "nome"),
    cidade: textoObrigatorio(body.cidade, "cidade"),
    gerente: textoObrigatorio(body.gerente, "gerente"),
  };
}

function tratarDuplicidade(err) {
  if (err.code === "23505") {
    throw conflict("Já existe uma filial com este nome.");
  }

  throw err;
}

// RF02: o administrador vê todas; o gestor, apenas a sua filial (RN12).
export async function listar(req, res) {
  const filialId = resolverEscopoFilial(req.usuario, undefined);

  res.json(await filialModel.listar(filialId));
}

export async function buscar(req, res) {
  const id = lerId(req.params.id);

  if (req.usuario.perfil !== "ADMIN" && id !== req.usuario.filialId) {
    throw forbidden("O gestor só pode acessar a filial a que está vinculado.");
  }

  const filial = await filialModel.buscarPorId(id);

  if (!filial) throw notFound("Filial não encontrada.");

  res.json(filial);
}

// RF14 / UC02
export async function criar(req, res) {
  const filial = await filialModel.criar(lerDados(req.body)).catch(tratarDuplicidade);

  res.status(201).json(filial);
}

export async function atualizar(req, res) {
  const id = lerId(req.params.id);
  const filial = await filialModel
    .atualizar(id, lerDados(req.body))
    .catch(tratarDuplicidade);

  if (!filial) throw notFound("Filial não encontrada.");

  res.json(filial);
}
