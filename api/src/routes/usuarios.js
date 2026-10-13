import { Router } from "express";
import { autenticar, exigirPerfil } from "../middleware/auth.js";
import * as usuarioController from "../controllers/usuarioController.js";

const router = Router();

router.use(autenticar, exigirPerfil("ADMIN"));

router.get("/", usuarioController.listar);
router.post("/", usuarioController.criar);
router.patch("/:id", usuarioController.alterarSituacao);

export default router;
