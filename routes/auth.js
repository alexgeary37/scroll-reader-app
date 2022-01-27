const express = require("express");
const router = express.Router();

const { check } = require("express-validator");
const { validateInput } = require("../middleware/validate-input");
const { login } = require("../controllers/auth");

router.post("/api/login", async (req, res) => {
  check("email", "Email is required").isEmail();
  check("password", "Password is required").not().isEmpty();
  // validateInput(req, res);
  login(req, res);
});

module.exports = router;

// [
//   check("email", "Email is required").isEmail(),
//   check("password", "Password is required").not().isEmpty(),
//   validateInput,
// ],
// login
