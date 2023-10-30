import { generateToken } from "../utils/jwt.js";

export const login = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send({
        mensaje: "No se pudo inciar sesion",
        error: "Contraseña invalida",
      });
    }

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
    };

    const token = generateToken(req.user);

    res.cookie("jwtCookie", token, { maxAge: 43200000 });

    res.status(200).json({
      status: "success",
      message: "Succesfully logged in!",
      payload: req.user,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: "There was an error tyring to log in",
      error: `${err}`,
    });
  }
};

export const logout = async (req, res) => {
  if (req.session) {
    req.session.destroy();
  }

  res.clearCookie("jwtCookie");
  res.status(200).json({ status: "success", message: "Logged out" });
};
