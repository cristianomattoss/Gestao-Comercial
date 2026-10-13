import { Filial } from "../models/Filial";

export function criarFilial(filiais, nome, cidade, gerente) {
  const novaFilial = new Filial(filiais.length + 1, nome, cidade, gerente);

  return [...filiais, novaFilial];
}
