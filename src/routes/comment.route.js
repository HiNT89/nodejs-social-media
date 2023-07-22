const commentController = require("../controllers/comment/comment.controller");
const commentDetailController = require("../controllers/comment/commentDetail.controller");
const express = require("express");
const { authJwt } = require("../middlewares");
const router = express.Router();
router.get(
  "/detail/:commentDetailID",
  commentDetailController.getCommentDetail,
);
router.post("/details", commentController.getArrCmtDt);
router.post("/create", commentDetailController.createCommentDetail);
router.get("/:commentID", commentController.getArrCmt);
module.exports = router;
