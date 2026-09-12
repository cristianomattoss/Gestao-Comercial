export class Usuario {
  constructor(email, senha, perfil, filial = null) {
    this.email = email;
    this.senha = senha;
    this.perfil = perfil;
    this.filial = filial;
  }
}
