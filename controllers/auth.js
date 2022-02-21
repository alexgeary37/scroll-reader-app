const { response } = require("express");

const login = async (req, res = response) => {
  const { email, password } = req.body;
  const correctEmail = process.env.EMAIL;
  const correctPassword = process.env.PASSWORD;

  // Ideally search the user in a database,
  // throw an error if not found.
  if (email !== correctEmail || password !== correctPassword) {
    return res.status(400).json({
      msg: "User / Password are incorrect",
    });
  }

  res.json({
    name: "Test User",
    token: "A JWT token to keep the user logged in.",
    msg: "Successful login",
  });
};

module.exports = {
  login,
};
