const express = require("express");
const router = express.Router();

// Catch all requests that don't match any route
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = router;
