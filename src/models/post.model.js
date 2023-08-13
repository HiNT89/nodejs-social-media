const mongoose = require("mongoose");

const { Schema, ObjectId } = mongoose;

const PostSchema = new Schema({
  description: { type: String },
  mediaURL: { type: String },
  createdAt: { type: Date },
  userID: { type: ObjectId, ref: "Information" },
  commentIDs: [{ type: ObjectId, ref: "Comment" }],
  type: { type: String },
  interaction: {
    like: [{ type: ObjectId, ref: "Information" }],
    share: [{ type: ObjectId, ref: "Information" }],
  },
  isRemove: { type: Boolean },
});

PostSchema.index({ description: "text" });
module.exports = mongoose.model("Post", PostSchema);
