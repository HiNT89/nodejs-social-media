const db = require("../../models");
const { findListCommentDetail } = require("../../utils/comment.function");
const { comment: Comment } = db;
class CommentController {
  // [GET] /comment/getArrCmt/:commentID ====> get arr commentDetailID
  getArrCmt(req, res, next) {
    const id = req.params.commentID;
    Comment.findById(id)
      .then((data) => res.status(200).json(data))
      .catch(next);
  }
  // [GET] /comment/getArrCmtDt ====> get arr commentDetail
  async getArrCmtDt(req, res, next) {
    const ids = req.body.ids;
    const response = await findListCommentDetail(ids);
    res.status(200).json(response);
  }
  // ===> create comment default when create post return commentID
  async createComment(req, res, next) {
    let result = "";
    const comment = new Comment({
      listComment: [],
    });
    await comment
      .save()
      .then((dataComment) => (result = dataComment._id))
      .catch(next);
    return result;
  }

  // ===> update comment default when create comment detail return T/F
  async updateComment(commentID, commentDetailID) {
    const commentItem = await Comment.findById(commentID)
      .then((data) => data)
      .catch((err) => console.log(err));
    await commentItem.listComment.push(commentDetailID);
    const result = await commentItem
      .save()
      .then(() => true)
      .catch(() => false);
    return result;
  }
}

module.exports = new CommentController();
