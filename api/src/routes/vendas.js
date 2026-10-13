import { Router } from "express";
import { autenticar, exigirPerfil } from "../middleware/auth.js";
import * as vendaController from "../controllers/vendaController.js";

const router = Router();

router.use(autenticar);

router.get("/", vendaController.listar);
router.get("/resumo", vendaController.resumo);
router.get("/mais-vendidos", vendaController.maisVendidos);
router.get("/por-categoria", vendaController.porCategoria);
router.get("/comparativo", exigirPerfil("ADMIN"), vendaController.comparativo);
router.get(
  "/participacao-filiais",
  exigirPerfil("ADMIN"),
  vendaController.participacaoPorFilial,
);

export default router;
