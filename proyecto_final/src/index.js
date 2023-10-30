import "dotenv/config.js";

import express from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import { __dirname } from "./utils/path.js";
import path from "path";
import router from "./routes/index.routes.js";
import session from "express-session";
import MongoStorage from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.js";
import cookieParser from "cookie-parser";

const PORT = 8080;
const app = express();

// * Database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected with database.");
  })
  .catch(err => conseole.log(`Error connecting with the database: ${err}`));

// * Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SIGNED_COOKIE));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "../views"));
app.use(
  session({
    store: MongoStorage.create({
      mongoUrl: process.env.MONGO_URL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 300, // En segundos
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// * Routes
app.use("/static", express.static(path.join(__dirname, "/public")));
app.use("/", router);

app.use("*", (req, res) => {
  res.send({ status: "error", message: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
