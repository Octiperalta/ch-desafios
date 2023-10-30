import "dotenv/config.js";

import local from "passport-local"; // ? Estrategia (en este caso username/password)
import passport from "passport"; // ? Manejador de las estrategias
import GitHubStrategy from "passport-github2";
import { createHash, validatePassword } from "../utils/bcrypt.js";
import userModel from "../models/users.models.js";
import jwt from "passport-jwt";

// * Defino la estrategia a utilizar
const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt; // ? Extractor de los headers de la consulta

const initializePassport = () => {
  const cookieExtractor = req => {
    // console.log(req.cookies);

    //  {}  - no hay cookies != no exista la cookies
    // {..} - si existe cookie, consulto ppor mi cookie y sino asigno {}
    const token = req.cookies ? req.cookies.jwtCookie : {};

    // console.log("token sacado de la cookie:", token);
    return token;
  };

  // * Defino JWT
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), // ? Consulto el token de las cookies
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload); // ? Retorno el contenido el token
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // * Se define el registro de usuario a traves de passport
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (
        req,
        username,
        password,
        done // ? seria el callback de respuest, algo  similar a res.status()
      ) => {
        // * En esta parte defino como voy a registrar un usuarios
        const { first_name, last_name, email, age } = req.body;

        try {
          const user = await userModel.findOne({ email: email });

          if (user) {
            return done(null, false);
          }

          const hashedPassword = createHash(password);
          const newUser = await userModel.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword,
          });

          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // * Defino la estrategia de LOGIN
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });

          if (!user) {
            return done(null, false);
          }

          if (validatePassword(password, user.password)) {
            return done(null, user); // * Usuario y contraseña VALIDOS
          }

          console.log("Usuario y contraseña no validos");
          return done(null, false); // * Usuario y contraseña NO VALIDOS
        } catch (error) {
          done(error);
        }
      }
    )
  );

  // * Defino el Login con GITHUB
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.GH_CLIENT_ID,
        clientSecret: process.env.GH_CLIENT_SECRET,
        callbackURL: process.env.GH_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("access token:", accessToken);
          console.log("refresh token:", refreshToken);

          const user = await userModel.findOne({ email: profile._json.email });

          if (!user) {
            const newUser = await userModel.create({
              first_name: profile._json.name,
              last_name: " ",
              email: profile._json.email,
              age: 18, // Edad por defecto
              password: "default_password",
            });

            return done(null, newUser);
          } else {
            return done(null, user);
          }
        } catch (err) {
          done(err);
        }
      }
    )
  );

  // * Para incicializar la sesion del usuario
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // * Elimina la session del usuario
  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);

    done(null, user);
  });
};

export default initializePassport;
