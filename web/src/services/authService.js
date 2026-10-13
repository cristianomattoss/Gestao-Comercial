import { requisitar, salvarToken, obterToken } from "./api";

export async function entrar(email, senha) {
  const { token, usuario } = await requisitar("/auth/login", {
    metodo: "POST",
    corpo: { email, senha },
  });

  salvarToken(token);

  return usuario;
}

export async function restaurarSessao() {
  if (!obterToken()) return null;

  try {
    const { usuario } = await requisitar("/auth/me");

    return usuario;
  } catch (erro) {
    if (erro.status === 401) salvarToken(null);

    return null;
  }
}

export function sair() {
  salvarToken(null);
}
