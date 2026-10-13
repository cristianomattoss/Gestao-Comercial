import {
  alterarSituacaoUsuario,
  cadastrarUsuario,
  listarUsuarios,
} from "../services/usuarioService";

export function carregarUsuarios() {
  return listarUsuarios();
}

export function criarUsuario(email, senha, perfil, filialId) {
  return cadastrarUsuario({
    email: email.trim(),
    senha,
    perfil,
    filialId: perfil === "GESTOR" ? Number(filialId) || undefined : undefined,
  });
}

export function definirSituacao(id, ativo) {
  return alterarSituacaoUsuario(id, ativo);
}
