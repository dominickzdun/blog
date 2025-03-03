const { Router } = require("express");
const loginController = require("../controllers/login_controller");

const router = Router();

router.get("/", (req, res) => {
  return res.send("Login page");
});

router.post("/", loginController.handleLogin);

module.exports = router;
