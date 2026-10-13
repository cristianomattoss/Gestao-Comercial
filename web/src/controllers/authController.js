export function autenticarUsuario(usuarios, email, senha) {
  return usuarios.find(
    (usuario) => usuario.email === email && usuario.senha === senha,
  );
}
