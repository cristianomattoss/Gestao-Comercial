import { entrar, restaurarSessao, sair } from "../services/authService";

export async function autenticarUsuario(email, senha) {
  try {
    return { usuario: await entrar(email, senha) };
  } catch (erro) {
    return { erro: erro.message };
  }
}

export function recuperarSessao() {
  return restaurarSessao();
}

export function encerrarSessao() {
  sair();
}
