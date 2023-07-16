const mongoose = require("mongoose");

const { Schema, ObjectId } = mongoose;

const CommentSchema = new Schema({
  CreateAt: { type: String },
  Post_id: { type: Schema.Types.ObjectId },
  Comment_content: { type: String },
  User_id: { type: Schema.Types.ObjectId },
  Reply: {
    IsReply: { type: Boolean },
    Sub_comment_id: [{ type: Schema.Types.ObjectId }],
  },
});
const Sub_commentSchema = new Schema({
  User_id: { type: Schema.Types.ObjectId },
  Comment_content: { type: String },
  CreateAt: { type: Date },
  User_target_id: { type: Schema.Types.ObjectId },
});

module.exports = mongoose.model("Sub_comment", Sub_commentSchema);
module.exports = mongoose.model("Comment", CommentSchema);
