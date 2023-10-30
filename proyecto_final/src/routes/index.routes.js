import apiRouter from "./api.routes.js";
import { Router } from "express";
import viewsRouter from "./views.routes.js";

const router = Router();

router.use("/api", apiRouter);
router.use("/static", viewsRouter); // * Una ruta para las vistas

export default router;
