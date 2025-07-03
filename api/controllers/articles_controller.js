const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
    validatePost,
    validateComment,
    handleValidationErrors,
} = require("../middleware/validation");

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
        res.status(500).json({
            error: "An error occurred while creating the post",
        });
    }
}

async function getAllPosts(req, res) {
    try {
        const allPosts = await prisma.post.findMany({
            where: { published: true },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                datePosted: "desc", // Sort by newest first
            },
        });
        const formattedPosts = allPosts.map((post) => ({
            ...post,
            datePosted: post.datePosted.toLocaleDateString("en-US"),
        }));

        res.json(formattedPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "An error occurred while retrieving posts",
        });
    }
}

async function getPostById(req, res) {
    const { id } = req.params;
    if (id == "user") {
        return;
    }
    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(id) },
        });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "An error occurred while retrieving the post",
        });
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
        res.status(500).json({
            error: "An error occurred while updating the article",
        });
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
        res.status(500).json({
            error: "An error occurred while deleting the post",
        });
    }
}

async function getComments(req, res) {
    const { postID } = req.params;

    try {
        // Check if post exists or is published
        // Then proceed with getting comments
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
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                datePosted: "desc", // Sort by newest first
            },
        });
        const formattedComments = comments.map((comment) => ({
            ...comment,
            datePosted: comment.datePosted.toLocaleDateString("en-US"),
        }));
        res.json(formattedComments);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "An error occurred while retrieving comments",
        });
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
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "An error occurred while creating the comment",
        });
    }
}

async function deleteComment(req, res) {
    const { postID, commentID } = req.params;
    const userId = req.user.id;

    try {
        const comment = await prisma.comment.findUnique({
            where: { id: parseInt(commentID) },
        });

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (comment.authorId !== userId) {
            return res.status(403).json({
                error: "You are not authorized to delete this comment",
            });
        }

        if (comment.postId !== parseInt(postID)) {
            return res
                .status(400)
                .json({ error: "Comment does not belong to this post" });
        }

        await prisma.comment.delete({
            where: { id: parseInt(commentID) },
        });

        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "An error occurred while deleting the comment",
        });
    }
}

async function updateComment(req, res) {
    const { commentID } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    try {
        const comment = await prisma.comment.findUnique({
            where: { id: parseInt(commentID) },
        });

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (comment.authorId !== userId) {
            return res.status(403).json({
                error: "You are not authorized to update this comment",
            });
        }

        const updatedComment = await prisma.comment.update({
            where: { id: parseInt(commentID) },
            data: {
                content,
            },
        });
        res.json(updatedComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "An error occurred while updating the comment",
        });
    }
}

async function getUserArticles(req, res) {
    const authorId = req.user.id;

    try {
        const posts = await prisma.post.findMany({
            where: {
                authorId: parseInt(authorId),
            },
            orderBy: {
                datePosted: "desc", // Sort by newest first
            },
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({
            error: "An error occurred while fetching posts",
        });
    }
}

// Combines controller with validation middleware
const createPostWithValidation = [
    validatePost,
    handleValidationErrors,
    createPost,
];

const createCommentWithValidation = [
    validateComment,
    handleValidationErrors,
    createComment,
];

module.exports = {
    createPost: createPostWithValidation,
    createComment: createCommentWithValidation,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getComments,
    deleteComment,
    updateComment,
    getUserArticles,
};
