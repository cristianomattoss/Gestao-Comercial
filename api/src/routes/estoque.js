import { Router } from "express";
import { autenticar } from "../middleware/auth.js";
import * as estoqueController from "../controllers/estoqueController.js";

const router = Router();

router.use(autenticar);

router.get("/", estoqueController.listar);

export default router;
