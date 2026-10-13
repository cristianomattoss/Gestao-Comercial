const URL_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const CHAVE_TOKEN = "gestao-comercial:token";

export function obterToken() {
  try {
    return localStorage.getItem(CHAVE_TOKEN);
  } catch {
    return null;
  }
}

export function salvarToken(token) {
  try {
    if (token) {
      localStorage.setItem(CHAVE_TOKEN, token);
    } else {
      localStorage.removeItem(CHAVE_TOKEN);
    }
  } catch {
    // armazenamento indisponível: a sessão vale só até recarregar a página
  }
}

export async function requisitar(caminho, { metodo = "GET", corpo } = {}) {
  const token = obterToken();
  let resposta;

  try {
    resposta = await fetch(`${URL_BASE}${caminho}`, {
      method: metodo,
      headers: {
        ...(corpo ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor.");
  }

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    const erro = new Error(dados?.erro ?? "Erro ao processar a requisição.");
    erro.status = resposta.status;
    throw erro;
  }

  return dados;
}
