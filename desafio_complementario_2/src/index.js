import "dotenv/config.js"; // ? Permite utilzar variables de entorno

import express from "express";
import mongoose from "mongoose";

import cartModel from "./models/carts.models.js";
import orderModel from "./models/orders.models.js";

import cookieParser from "cookie-parser";
import session from "express-session";
// import FileStorage from "session-file-store";
import MongoStorage from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.js";
import router from "./routes/index.routes.js";

const app = express();
const PORT = 4000;

// ! Esto ya no seria necesario ya que mas abajo ya se conecta con MONGO

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected with the database");
  })
  .catch(err => {
    console.log(`Error connecting with database: ${err}`);
  });

// * MIDDLEWARES
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(
  session({
    // store: new fileStorage({ path: "./sessions", ttl: 10000, retries: 1 }),
    store: MongoStorage.create({
      mongoUrl: process.env.MONGO_URL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 90, // En segundos
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// * ROUTES
app.use("/", router);

// * SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
