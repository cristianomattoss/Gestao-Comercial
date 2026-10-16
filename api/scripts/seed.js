// Carrega no banco os dados de exemplo hoje usados como mock pelo frontend.
import bcrypt from "bcryptjs";
import { pool } from "../src/db.js";
import {
  filiais,
  categorias,
  produtos,
  vendas,
  estoque,
} from "../../web/src/data/pdvData.js";

// Não importa web/src/data/usuariosData.js: ele usa imports sem extensão (bundler), que o Node não resolve.
const usuariosIniciais = [
  { email: "admin@empresa.com", senha: "123456", perfil: "ADMIN", filial: null },
  { email: "gestor1@empresa.com", senha: "123456", perfil: "GESTOR", filial: "Filial Centro" },
  { email: "gestor2@empresa.com", senha: "123456", perfil: "GESTOR", filial: "Filial Norte" },
];

const client = await pool.connect();

try {
  await client.query("BEGIN");
  await client.query(
    `TRUNCATE estoque, vendas, produtos, categorias, usuarios, filiais
     RESTART IDENTITY CASCADE`,
  );

  for (const f of filiais) {
    await client.query(
      "INSERT INTO filiais (id, nome, cidade, gerente) VALUES ($1, $2, $3, $4)",
      [f.id, f.nome, f.cidade, f.gerente],
    );
  }

  for (const c of categorias) {
    await client.query("INSERT INTO categorias (id, nome) VALUES ($1, $2)", [
      c.id,
      c.nome,
    ]);
  }

  for (const p of produtos) {
    await client.query(
      "INSERT INTO produtos (id, nome, categoria_id) VALUES ($1, $2, $3)",
      [p.id, p.nome, p.categoriaId],
    );
  }

  for (const v of vendas) {
    await client.query(
      `INSERT INTO vendas (id, filial_id, produto_id, quantidade, valor_total, mes, forma_pagamento)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [v.id, v.filialId, v.produtoId, v.quantidade, v.valorTotal, v.mes, v.formaPagamento],
    );
  }

  for (const e of estoque) {
    await client.query(
      `INSERT INTO estoque (filial_id, produto_id, quantidade, estoque_minimo)
       VALUES ($1, $2, $3, $4)`,
      [e.filialId, e.produtoId, e.quantidade, e.estoqueMinimo],
    );
  }

  for (const u of usuariosIniciais) {
    const filial = filiais.find((f) => f.nome === u.filial);
    await client.query(
      `INSERT INTO usuarios (email, senha_hash, perfil, filial_id)
       VALUES ($1, $2, $3, $4)`,
      [u.email, await bcrypt.hash(u.senha, 10), u.perfil, filial?.id ?? null],
    );
  }

  // Ajusta as sequences depois de inserir ids explícitos.
  for (const tabela of ["filiais", "categorias", "produtos", "vendas"]) {
    await client.query(
      `SELECT setval(pg_get_serial_sequence('${tabela}', 'id'),
                     (SELECT COALESCE(MAX(id), 1) FROM ${tabela}))`,
    );
  }

  await client.query("COMMIT");
  console.log("Seed concluído.");
} catch (err) {
  await client.query("ROLLBACK");
  throw err;
} finally {
  client.release();
  await pool.end();
}
