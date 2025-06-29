const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
const cors = require("cors");
require("dotenv").config();
const app = express();
const passport = require("./passport");

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

app.use(passport.initialize());

app.use("/articles", routes.articles);
app.use("/login", routes.login);
app.use("/signup", routes.signup);

app.listen(process.env.PORT, () => console.log("Server started"));
