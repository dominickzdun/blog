const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
require("dotenv").config();
const app = express();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
require("./passport");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

app.use("/", routes.main);
app.use("/articles", routes.articles);
app.use("/login", routes.login);
app.use("/signup", routes.signup);

app.listen(process.env.PORT, () => console.log("Server started"));
