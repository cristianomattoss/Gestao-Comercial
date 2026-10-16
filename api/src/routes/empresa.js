import { Router } from "express";
import { autenticar, exigirPerfil } from "../middleware/auth.js";
import * as empresaController from "../controllers/empresaController.js";

const router = Router();

router.use(autenticar, exigirPerfil("ADMIN"));

router.get("/", empresaController.buscar);
router.put("/", empresaController.salvar);

export default router;
