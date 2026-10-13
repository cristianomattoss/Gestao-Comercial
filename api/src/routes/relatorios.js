import { Router } from "express";
import { autenticar } from "../middleware/auth.js";
import * as relatorioController from "../controllers/relatorioController.js";

const router = Router();

router.use(autenticar);

router.post("/", relatorioController.gerar);
router.get("/recentes", relatorioController.recentes);
router.get("/:id/exportar", relatorioController.exportarRelatorio);

export default router;
