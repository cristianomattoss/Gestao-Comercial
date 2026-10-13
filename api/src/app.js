import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { HttpError } from "./errors.js";
import authRoutes from "./routes/auth.js";
import filiaisRoutes from "./routes/filiais.js";
import vendasRoutes from "./routes/vendas.js";
import estoqueRoutes from "./routes/estoque.js";
import catalogoRoutes from "./routes/catalogo.js";

export const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/auth", authRoutes);
app.use("/filiais", filiaisRoutes);
app.use("/vendas", vendasRoutes);
app.use("/estoque", estoqueRoutes);
app.use("/", catalogoRoutes);

app.use((req, res) => res.status(404).json({ erro: "Rota não encontrada." }));

app.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ erro: err.message });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "JSON inválido." });
  }

  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor." });
});
