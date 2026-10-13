import { Usuario } from "../models/Usuario";

export const usuariosIniciais = [
  new Usuario("admin@empresa.com", "123456", "ADMIN"),
  new Usuario("gestor1@empresa.com", "123456", "GESTOR", "Filial Centro"),
  new Usuario("gestor2@empresa.com", "123456", "GESTOR", "Filial Norte"),
];
