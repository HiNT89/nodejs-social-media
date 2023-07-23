const db = require("../../models");
const { commentDetail: CommentDetail } = db;
const commentController = require("./comment.controller");
const {
  findCommentDetail,
  findListCommentDetail,
} = require("../../utils/comment.function");
class CommentDetailController {
  //  get comment detail by comment id => return commentID
  async getCommentDetail(req, res, next) {
    const id = req.params.commentDetailID;
    const response = await messageFunction.findCommentDetail(id);
    if (!response) {
      res.status(400).send("error !");
      return;
    }
    res.status(200).json(response);
  }
  // [POST] /comment/create ====> create comment detail + update comment (add)
  async createCommentDetail(req, res, next) {
    const { commentContent, userID, reply, commentID } = req.body;

    const commentDetail = new CommentDetail({
      createAt: new Date(),
      commentContent,
      userID,
      isSubComment: !!reply,
      reply: reply ? reply : null,
    });
    commentDetail
      .save()
      .then((data) => {
        const conditions = commentController.updateComment(commentID, data._id);
        if (conditions) res.status(200).send("create comment detail success !");
      })
      .catch(next);
  }
}

module.exports = new CommentDetailController();
