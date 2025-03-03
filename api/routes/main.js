const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  return res.send("Received a GET HTTP method");
});

module.exports = router;
