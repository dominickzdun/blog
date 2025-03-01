const { Router } = require("express");
const signupController = require("../controllers/signup_controller");
const router = Router();

router.get("/", (req, res) => {
  return res.send("Signup page");
});

router.post("/",signupController.signup);

module.exports = router;
