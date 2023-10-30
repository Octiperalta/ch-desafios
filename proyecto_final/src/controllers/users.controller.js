export const register = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        status: "error",
        message: "There was an error while trying to register",
        error: "User already exists",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Usuario creado correctamente!",
      payload: req.user,
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: "There was an error trying to register",
      error: `${err}`,
    });
  }
};
