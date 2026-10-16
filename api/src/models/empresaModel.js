import { pool } from "../db.js";

const COLUNAS = `razao_social AS "razaoSocial", nome_fantasia AS "nomeFantasia", cnpj,
  inscricao_estadual AS "inscricaoEstadual", endereco, cidade, estado, telefone, email`;

export async function buscar() {
  const { rows } = await pool.query(`SELECT ${COLUNAS} FROM empresa WHERE id = 1`);

  return rows[0];
}

export async function salvar(d) {
  const { rows } = await pool.query(
    `INSERT INTO empresa (id, razao_social, nome_fantasia, cnpj, inscricao_estadual,
                          endereco, cidade, estado, telefone, email)
     VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (id) DO UPDATE SET
       razao_social = EXCLUDED.razao_social, nome_fantasia = EXCLUDED.nome_fantasia,
       cnpj = EXCLUDED.cnpj, inscricao_estadual = EXCLUDED.inscricao_estadual,
       endereco = EXCLUDED.endereco, cidade = EXCLUDED.cidade, estado = EXCLUDED.estado,
       telefone = EXCLUDED.telefone, email = EXCLUDED.email
     RETURNING ${COLUNAS}`,
    [
      d.razaoSocial, d.nomeFantasia, d.cnpj, d.inscricaoEstadual,
      d.endereco, d.cidade, d.estado, d.telefone, d.email,
    ],
  );

  return rows[0];
}
