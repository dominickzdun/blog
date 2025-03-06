const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createPost(req, res) {
  const { title, content, published } = req.body;

  const authorId = req.user.id;
  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
        published,
      },
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the post" });
  }
}

async function getAllPosts(req, res) {
  try {
    const allPosts = await prisma.post.findMany({ where: { published: true } });
    res.json(allPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while retrieving posts" });
  }
}

async function getPostById(req, res) {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the post" });
  }
}

async function updatePost(req, res) {
  const { id } = req.params;
  const { title, content, published } = req.body;
  const userId = req.user.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.authorId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this post" });
    }

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
  const userId = req.user.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.authorId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this post" });
    }

    await prisma.post.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the post" });
  }
}

async function getComments(req, res) {
  const { postID } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(postID),
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.published === false) {
      return res
        .status(403)
        .json({ error: "This post hasn't been published yet" });
    }

    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(postID) },
    });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving comments" });
  }
}

async function createComment(req, res) {
  const { postID } = req.params;
  const { content } = req.body;
  const authorId = req.user.id;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(postID),
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.published === false) {
      return res
        .status(403)
        .json({ error: "You cannot comment on a draft post" });
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(postID),
        authorId: authorId,
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the comment" });
  }
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getComments,
  createComment,
};
