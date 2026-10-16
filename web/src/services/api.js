const URL_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const CHAVE_TOKEN = "gestao-comercial:token";

// Disparado quando a API recusa o token (expirado ou usuário inativado) numa sessão em uso.
export const EVENTO_SESSAO_EXPIRADA = "gestao-comercial:sessao-expirada";

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

async function enviar(caminho, { metodo = "GET", corpo } = {}) {
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

  if (resposta.status === 401 && token && caminho !== "/auth/login") {
    salvarToken(null);
    window.dispatchEvent(new Event(EVENTO_SESSAO_EXPIRADA));
  }

  if (!resposta.ok) {
    const dados = await resposta.json().catch(() => null);
    const erro = new Error(dados?.erro ?? "Erro ao processar a requisição.");
    erro.status = resposta.status;
    throw erro;
  }

  return resposta;
}

export async function requisitar(caminho, opcoes) {
  const resposta = await enviar(caminho, opcoes);

  return resposta.json();
}

// Baixa um arquivo autenticado (o token vai no cabeçalho, não na URL).
export async function baixarArquivo(caminho) {
  const resposta = await enviar(caminho);
  const disposicao = resposta.headers.get("Content-Disposition") ?? "";
  const nome = /filename="?([^";]+)"?/.exec(disposicao)?.[1] ?? "relatorio";
  const url = URL.createObjectURL(await resposta.blob());
  const link = document.createElement("a");

  link.href = url;
  link.download = nome;
  link.click();
  URL.revokeObjectURL(url);
}
