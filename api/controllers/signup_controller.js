const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { body, validationResult } = require("express-validator");

const validateSignup = [
  body("username", "Username must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom(async (username) => {
      if (!/^[a-zA-Z0-9-]+$/.test(username)) {
        return Promise.reject(
          "Username must only contain letters, numbers, or hyphens."
        );
      }
      const userExists = await prisma.user.findUnique({
        where: {
          name: username,
        },
      });
      if (userExists) {
        return Promise.reject(
          "Username already exists. Please choose a different one."
        );
      }
    }),
  body(
    "password",
    "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, one number, and one symbol."
  )
    .trim()
    .isStrongPassword()
    .escape(),
  body("confirmPassword", "Passwords do not match.").custom(
    (value, { req }) => value === req.body.password
  ),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  next();
};

async function handleSignup(req, res) {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        name: username,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the user" });
  }
}

const signup = [...validateSignup, handleValidationErrors, handleSignup];

module.exports = {
  signup,
};
