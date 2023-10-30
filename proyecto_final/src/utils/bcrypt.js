import bcrypt from "bcrypt";

// ? Encripta contraseña
export const createHash = password => {
  return bcrypt.hashSync(
    password,
    bcrypt.genSaltSync(parseInt(process.env.SALT))
  );
};

// ? Compara las contraseñas => La ingresada por la peticion vs. la hasgheada de la BD
export const validatePassword = (passwordSent, passwordDB) => {
  return bcrypt.compareSync(passwordSent, passwordDB);
};
