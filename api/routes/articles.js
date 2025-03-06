const { Router } = require("express");
const passport = require("passport");
const articlesController = require("../controllers/articles_controller");
const router = Router();

router.get("/", articlesController.getAllPosts);

router.get("/:id", articlesController.getPostById);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  articlesController.updatePost
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  articlesController.deletePost
);

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  articlesController.createPost
);

router.get("/:postID/comments", articlesController.getComments);

router.post(
  "/:postID/comments",
  passport.authenticate("jwt", { session: false }),
  articlesController.createComment
);

module.exports = router;
