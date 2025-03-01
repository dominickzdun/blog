const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// HANDLE SIGNUP VALIDATION 

async function signup(req, res) {
  const { username, password } = req.body;

  const userExists = await prisma.user.findUnique({
    where: {
      name: username,
    },
  });

  if (userExists) {
    return res.status(400).json({ error: "Username already exists" });
  }

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

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

module.exports = {
  signup,
};
