const { body } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { validationResult } = require("express-validator");

const validatePost = [
    body("title")
        .isString()
        .isLength({ min: 3, max: 100 })
        .withMessage("Title must be between 3 and 100 characters."),
    body("content")
        .isString()
        .isLength({ min: 10 })
        .withMessage("Content must be at least 10 characters."),
    body("published").isBoolean().withMessage("Published must be a boolean."),
];

const validateComment = [
    body("content")
        .isString()
        .isLength({ min: 1, max: 500 })
        .withMessage("Content must be between 1 and 500 characters."),
];

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

module.exports = {
    validatePost,
    validateComment,
    validateSignup,
    handleValidationErrors,
};
