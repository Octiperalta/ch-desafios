import passport from "passport";
import local from "passport-local";
import userModel from "../models/users.models.js";
import { createHash, validatePassword } from "../utils/bcrypt.js";
import GitHubStrategy from "passport-github2";
const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          const user = await userModel.findOne({ email: username });

          if (user) {
            return done(null, false);
          }

          const encryptedPassword = createHash(password);
          const newUser = await userModel.create({
            first_name,
            last_name,
            email,
            password: encryptedPassword,
            age,
          });

          return done(null, newUser);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

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
            return done(null, user);
          }

          return done(null, false);
        } catch (err) {
          return done(null, false);
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
          const user = await userModel.findOne({ email: profile._json.email });

          if (user) {
            return done(null, false);
          } else {
            const newUser = await userModel.create({
              first_name: profile._json.name,
              last_name: " ",
              email: profile._json.email,
              age: 18, // Edad por defecto
              password: "default_password",
            });

            done(null, newUser);
          }
        } catch (err) {
          done(err);
        }
      }
    )
  );

  // * Sesiones
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);

    done(null, user);
  });
};

export default initializePassport;
