const { Router } = require("express");
const loginController = require("../controllers/login_controller");

const router = Router();

router.post("/", loginController.handleLogin);

module.exports = router;
