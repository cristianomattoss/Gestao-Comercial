import { pool } from "../db.js";

export async function listarCategorias() {
  const { rows } = await pool.query(
    "SELECT id, nome FROM categorias ORDER BY nome",
  );

  return rows;
}

export async function listarProdutos(categoriaId) {
  const { rows } = await pool.query(
    `SELECT p.id, p.nome, p.categoria_id AS "categoriaId", c.nome AS categoria
     FROM produtos p
     JOIN categorias c ON c.id = p.categoria_id
     WHERE ($1::int IS NULL OR p.categoria_id = $1)
     ORDER BY p.nome`,
    [categoriaId ?? null],
  );

  return rows;
}
