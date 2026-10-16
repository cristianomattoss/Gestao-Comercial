import * as empresaModel from "../models/empresaModel.js";
import { lerDadosEmpresa } from "../validacao.js";

// RF13: sem cadastro ainda, devolve null para a tela exibir o formulário vazio.
export async function buscar(req, res) {
  res.json((await empresaModel.buscar()) ?? null);
}

export async function salvar(req, res) {
  res.json(await empresaModel.salvar(lerDadosEmpresa(req.body)));
}
