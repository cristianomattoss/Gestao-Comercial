import { pool } from "../db.js";
import { Estoque } from "./situacaoEstoque.js";

export async function listar({ filialId, categoriaId }) {
  const { rows } = await pool.query(
    `SELECT e.filial_id AS "filialId", f.nome AS filial,
            e.produto_id AS "produtoId", p.nome AS produto,
            c.id AS "categoriaId", c.nome AS categoria,
            e.quantidade, e.estoque_minimo AS "estoqueMinimo"
     FROM estoque e
     JOIN filiais f ON f.id = e.filial_id
     JOIN produtos p ON p.id = e.produto_id
     JOIN categorias c ON c.id = p.categoria_id
     WHERE ($1::int IS NULL OR e.filial_id = $1)
       AND ($2::int IS NULL OR c.id = $2)
     ORDER BY f.nome, p.nome`,
    [filialId ?? null, categoriaId ?? null],
  );

  return rows.map((row) => new Estoque(row));
}
