const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function handleLogin(req, res) {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { name: username },
        });
        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid username or password" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res
                .status(401)
                .json({ message: "Invalid username or password" });
        }

        const payload = { id: user.id, username: user.name };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION,
        });

        return res.json({ message: "Logged in successfully", token });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "An error occurred during login" });
    }
}

module.exports = {
    handleLogin,
};
