import cartRouter from "./cart.routes.js";
import productRouter from "./products.routes.js";
import sessionRouter from "./sessions.routes.js";
import userRouter from "./users.routes.js";
import { Router } from "express";

const apiRouter = Router();

apiRouter.use("/products", productRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/carts", cartRouter);
apiRouter.use("/sessions", sessionRouter);

export default apiRouter;
