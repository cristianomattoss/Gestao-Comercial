import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { config } from "../config.js";
import { autenticar } from "../middleware/auth.js";

const router = Router();

const SELECT_USUARIO = `
  SELECT u.id, u.email, u.senha_hash, u.perfil, u.ativo, u.filial_id, f.nome AS filial
  FROM usuarios u
  LEFT JOIN filiais f ON f.id = u.filial_id
`;

function serializar(row) {
  return {
    id: row.id,
    email: row.email,
    perfil: row.perfil,
    filialId: row.filial_id,
    filial: row.filial,
  };
}

router.post("/login", async (req, res) => {
  const { email, senha } = req.body ?? {};

  if (typeof email !== "string" || typeof senha !== "string") {
    return res.status(400).json({ erro: "Informe e-mail e senha." });
  }

  const { rows } = await pool.query(`${SELECT_USUARIO} WHERE u.email = $1`, [
    email.trim().toLowerCase(),
  ]);
  const row = rows[0];

  if (!row || !(await bcrypt.compare(senha, row.senha_hash))) {
    return res.status(401).json({ erro: "E-mail ou senha inválidos." });
  }

  // UC01: credenciais corretas, mas o acesso foi inativado pelo administrador.
  if (!row.ativo) {
    return res.status(403).json({ erro: "Usuário inativo. Fale com o administrador." });
  }

  const usuario = serializar(row);
  const token = jwt.sign(
    { perfil: usuario.perfil, filialId: usuario.filialId },
    config.jwtSecret,
    { subject: String(usuario.id), expiresIn: config.jwtExpiresIn },
  );

  res.json({ token, usuario });
});

router.get("/me", autenticar, async (req, res) => {
  const { rows } = await pool.query(`${SELECT_USUARIO} WHERE u.id = $1`, [
    req.usuario.id,
  ]);

  if (!rows[0] || !rows[0].ativo) {
    return res.status(401).json({ erro: "Usuário não encontrado ou inativo." });
  }

  res.json({ usuario: serializar(rows[0]) });
});

export default router;
