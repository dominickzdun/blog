const { Router } = require("express");
const signupController = require("../controllers/signup_controller");
const router = Router();

router.post("/",signupController.signup);

module.exports = router;
