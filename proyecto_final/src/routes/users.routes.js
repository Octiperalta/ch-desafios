import { Router } from "express";
import passport from "passport";
import { register } from "../controllers/users.controller.js";

const userRouter = Router();

// * Register utilizando PASSPORT
userRouter.post("/", passport.authenticate("register"), register);

export default userRouter;
