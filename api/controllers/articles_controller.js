const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createPost(req, res) {
  const { title, content, authorId, published } = req.body;

  try {
    const newArticle = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
        published,
      },
    });
    res.status(201).json(newArticle);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the article" });
  }
}

async function getAllPosts(req, res) {
  try {
    const allPosts = await prisma.post.findMany({ where: { published: true } });
    res.json(allPosts);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving articles" });
  }
}

async function getPostById(req, res) {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });
    if (!post) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the article" });
  }
}

async function updatePost(req, res) {
  const { id } = req.params;
  const { title, content, published } = req.body;

  try {
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        published,
      },
    });
    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the article" });
  }
}

async function deletePost(req, res) {
  const { id } = req.params;

  try {
    await prisma.post.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the article" });
  }
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
