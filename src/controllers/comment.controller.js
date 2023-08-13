const db = require("../models");
const { comment: Comment, post: Post } = db;
class CommentController {
  async create(req, res, next) {
    const id = req.userID;
    const payload = req.body;
    const listKeysValidate = ["commentContent", "reply", "postID"];
    const keys = Object.keys(payload);
    keys.forEach((it) => {
      const checkPayload = listKeysValidate.includes(it);
      if (!checkPayload) {
        return res.status(400).send({ massage: "payload error" });
      }
    });
    const { commentContent, reply, postID } = payload;
    const comment = new Comment({
      userID: id,
      reply: !reply ? null : reply,
      comment: commentContent,
      createdAt: new Date(),
    });
    if (!postID || typeof postID !== "string")
      return res.status(400).send("postID not found");

    try {
      const commentRes = await comment.save();
      const postRes = await Post.findById(postID);
      postRes.commentIDs = [...postRes.commentIDs, commentRes._id];
      postRes
        .save()
        .then(() => res.send({ message: "create comment success" }));
    } catch (e) {
      return res.status(400).send(e);
    }
  }
  async delete(req, res, next) {
    const commentID = req.params.commentID;
    const { postID } = req.body;
    if (!postID || typeof postID !== "string")
      return res.status(400).send("postID not found");
    try {
      await Comment.deleteOne({ _id: commentID });
      const postItem = await Post.findById(postID);
      postItem.commentIDs = postItem.commentIDs.filter(
        (x) => x.toString() !== commentID,
      );
      postItem.save().then(() => {
        res.status(200).send({ message: "delete comment success !!" });
      });
    } catch (e) {
      res.status(400).send({ message: e });
    }
  }
  async update(req, res, next) {
    const commentID = req.params.commentID;
    const payload = req.body;
    const keys = Object.keys(payload);
    keys.forEach((it) => {
      const checkPayload = it === "commentContent";
      if (!checkPayload) {
        return res.status(400).send({ massage: "payload error" });
      }
    });
    try {
      const commentItem = await Comment.findById(commentID);
      commentItem.comment = payload.commentContent;
      commentItem.save().then(() => {
        res.status(200).send("update comment success !!");
      });
    } catch (e) {
      res.status(400).send(e);
    }
  }
}
module.exports = new CommentController();
