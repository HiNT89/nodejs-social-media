const mongoose = require("mongoose");

const { Schema, ObjectId } = mongoose;

const PostSchema = new Schema({
  description: { type: String },
  type: { type: String },
  mediaUrl: { type: String },
  interaction: {
    like: [{ type: String }],
    share: [{ type: String }],
  },
  isRemove: {
    type: Boolean,
    default: false,
  },
  createAt: { type: Date },
  userCreateId: { type: ObjectId },
  commentID: { type: ObjectId },
});

module.exports = mongoose.model("Post", PostSchema);
