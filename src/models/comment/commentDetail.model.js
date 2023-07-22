const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const CommentDetailSchema = new Schema({
  createAt: { type: Date },
  commentContent: { type: String },
  userID: { type: ObjectId },
  isSubComment: {
    type: Boolean,
  },
  reply: {
    type: ObjectId || null,
  },
});

module.exports = mongoose.model("CommentDetail", CommentDetailSchema);
