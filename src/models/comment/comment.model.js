const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const CommentSchema = new Schema({
  listComment: { type: [{ type: ObjectId }] },
});

module.exports = mongoose.model("Comment", CommentSchema);
