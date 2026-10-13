import { Usuario } from "../models/Usuario";

export function criarUsuario(usuarios, email, senha, perfil, filial = null) {
  const novoUsuario = new Usuario(email, senha, perfil, filial);

  return [...usuarios, novoUsuario];
}
