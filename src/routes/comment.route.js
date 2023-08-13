const commentController = require("../controllers/comment.controller");
const express = require("express");
const { authJwt } = require("../middlewares");
const router = express.Router();
router.post("/create", [authJwt.verifyToken], commentController.create);
router.delete(
  "/delete/:commentID",
  [authJwt.verifyToken],
  commentController.delete,
);
router.patch(
  "/update/:commentID",
  [authJwt.verifyToken],
  commentController.update,
);

module.exports = router;
