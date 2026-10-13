import { requisitar } from "./api";

export function listarUsuarios() {
  return requisitar("/usuarios");
}

export function cadastrarUsuario({ email, senha, perfil, filialId }) {
  return requisitar("/usuarios", {
    metodo: "POST",
    corpo: { email, senha, perfil, filialId },
  });
}

export function alterarSituacaoUsuario(id, ativo) {
  return requisitar(`/usuarios/${id}`, { metodo: "PATCH", corpo: { ativo } });
}
