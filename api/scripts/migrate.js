import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { pool } from "../src/db.js";

const dir = fileURLToPath(new URL("../migrations/", import.meta.url));

const client = await pool.connect();

try {
  await client.query(
    `CREATE TABLE IF NOT EXISTS migrations (
       nome TEXT PRIMARY KEY,
       aplicada_em TIMESTAMPTZ NOT NULL DEFAULT now()
     )`,
  );

  const { rows } = await client.query("SELECT nome FROM migrations");
  const aplicadas = new Set(rows.map((r) => r.nome));
  const arquivos = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();

  for (const arquivo of arquivos) {
    if (aplicadas.has(arquivo)) continue;

    await client.query("BEGIN");
    try {
      await client.query(await readFile(dir + arquivo, "utf8"));
      await client.query("INSERT INTO migrations (nome) VALUES ($1)", [arquivo]);
      await client.query("COMMIT");
      console.log(`Aplicada: ${arquivo}`);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  }

  console.log("Migrations em dia.");
} finally {
  client.release();
  await pool.end();
}
