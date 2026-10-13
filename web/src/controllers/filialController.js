import { cadastrarFilial, listarFiliais } from "../services/filialService";

export async function carregarFiliais() {
  return listarFiliais();
}

export async function criarFilial(nome, cidade, gerente) {
  return cadastrarFilial({
    nome: nome.trim(),
    cidade: cidade.trim(),
    gerente: gerente.trim(),
  });
}
