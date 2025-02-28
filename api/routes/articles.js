const { Router } = require("express");
const articlesController = require("../controllers/articles_controller");
const router = Router();

router.get("/", articlesController.getAllPosts);

//USE AUTH

router.get("/:id", articlesController.getPostById);

router.put("/:id", articlesController.updatePost);

router.delete("/:id", articlesController.deletePost);

router.post("/create", articlesController.createPost);

//USE AUTH

module.exports = router;
