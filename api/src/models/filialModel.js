import { pool } from "../db.js";

const COLUNAS = "id, nome, cidade, gerente";

export async function listar(filialId) {
  const { rows } = await pool.query(
    `SELECT ${COLUNAS} FROM filiais
     WHERE ($1::int IS NULL OR id = $1)
     ORDER BY nome`,
    [filialId ?? null],
  );

  return rows;
}

export async function buscarPorId(id) {
  const { rows } = await pool.query(
    `SELECT ${COLUNAS} FROM filiais WHERE id = $1`,
    [id],
  );

  return rows[0];
}

export async function criar({ nome, cidade, gerente }) {
  const { rows } = await pool.query(
    `INSERT INTO filiais (nome, cidade, gerente)
     VALUES ($1, $2, $3) RETURNING ${COLUNAS}`,
    [nome, cidade, gerente],
  );

  return rows[0];
}

export async function atualizar(id, { nome, cidade, gerente }) {
  const { rows } = await pool.query(
    `UPDATE filiais SET nome = $2, cidade = $3, gerente = $4
     WHERE id = $1 RETURNING ${COLUNAS}`,
    [id, nome, cidade, gerente],
  );

  return rows[0];
}
