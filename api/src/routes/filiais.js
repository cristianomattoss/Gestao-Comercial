import { Router } from "express";
import { autenticar, exigirPerfil } from "../middleware/auth.js";
import * as filialController from "../controllers/filialController.js";

const router = Router();

router.use(autenticar);

router.get("/", filialController.listar);
router.get("/:id", filialController.buscar);
router.post("/", exigirPerfil("ADMIN"), filialController.criar);
router.put("/:id", exigirPerfil("ADMIN"), filialController.atualizar);

export default router;
