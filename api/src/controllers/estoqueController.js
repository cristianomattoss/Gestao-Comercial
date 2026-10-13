import * as estoqueModel from "../models/estoqueModel.js";
import { SITUACOES } from "../models/situacaoEstoque.js";
import { badRequest } from "../errors.js";
import { lerIdOpcional, resolverEscopoFilial } from "../validacao.js";

// RF05 / UC05: itens classificados pelo padrão State, resumo e alertas de reposição.
export async function listar(req, res) {
  const filialId = resolverEscopoFilial(
    req.usuario,
    lerIdOpcional(req.query.filialId, "filialId"),
  );
  const categoriaId = lerIdOpcional(req.query.categoriaId, "categoriaId");
  const { situacao } = req.query;

  if (situacao !== undefined && !SITUACOES.includes(situacao)) {
    throw badRequest(`Situação inválida. Use: ${SITUACOES.join(", ")}.`);
  }

  const todos = await estoqueModel.listar({ filialId, categoriaId });
  const itens = situacao
    ? todos.filter((item) => item.situacao?.codigo === situacao)
    : todos;

  const resumo = Object.fromEntries(SITUACOES.map((codigo) => [codigo, 0]));
  for (const item of todos) {
    if (item.situacao) resumo[item.situacao.codigo] += 1;
  }

  res.json({
    resumo,
    alertas: itens.map((item) => item.gerarAlerta()).filter(Boolean),
    itens,
  });
}
