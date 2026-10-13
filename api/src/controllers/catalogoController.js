import * as catalogoModel from "../models/catalogoModel.js";
import { lerIdOpcional } from "../validacao.js";

export async function listarCategorias(req, res) {
  res.json(await catalogoModel.listarCategorias());
}

// RF04
export async function listarProdutos(req, res) {
  const categoriaId = lerIdOpcional(req.query.categoriaId, "categoriaId");

  res.json(await catalogoModel.listarProdutos(categoriaId));
}
