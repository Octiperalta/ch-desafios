import passport from "passport";
import local from "passport-local";
import userModel from "../models/users.models.js";
import { createHash, validatePassword } from "../utils/bcrypt.js";
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

  // *Sesiones
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);

    done(null, user);
  });
};

export default initializePassport;
