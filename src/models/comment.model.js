const mongoose = require("mongoose");

const { Schema, ObjectId } = mongoose;

const CommentSchema = new Schema({
  userID: { type: ObjectId, ref: "Information" },
  reply: ObjectId || null,
  comment: { type: String },
  createdAt: { type: Date },
});

module.exports = mongoose.model("Comment", CommentSchema);
