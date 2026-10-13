import bcrypt from "bcryptjs";
import { pool } from "../db.js";

const SELECT = `
  SELECT u.id, u.email, u.perfil, u.ativo, u.filial_id AS "filialId", f.nome AS filial
  FROM usuarios u
  LEFT JOIN filiais f ON f.id = u.filial_id
`;

export async function listar() {
  const { rows } = await pool.query(`${SELECT} ORDER BY u.email`);

  return rows;
}

export async function buscarPorId(id) {
  const { rows } = await pool.query(`${SELECT} WHERE u.id = $1`, [id]);

  return rows[0];
}

export async function criar({ email, senha, perfil, filialId }) {
  const { rows } = await pool.query(
    `INSERT INTO usuarios (email, senha_hash, perfil, filial_id)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [email, await bcrypt.hash(senha, 10), perfil, filialId ?? null],
  );

  return buscarPorId(rows[0].id);
}

export async function definirAtivo(id, ativo) {
  const { rowCount } = await pool.query(
    "UPDATE usuarios SET ativo = $2 WHERE id = $1",
    [id, ativo],
  );

  return rowCount > 0 ? buscarPorId(id) : undefined;
}
