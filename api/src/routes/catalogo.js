import { Router } from "express";
import { autenticar } from "../middleware/auth.js";
import * as catalogoController from "../controllers/catalogoController.js";

const router = Router();

router.get("/categorias", autenticar, catalogoController.listarCategorias);
router.get("/produtos", autenticar, catalogoController.listarProdutos);

export default router;
