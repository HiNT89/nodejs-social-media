const mongoose = require("mongoose");

const { Schema, ObjectId } = mongoose;

const PostSchema = new Schema({
  Description: { type: String },
  Type: { type: String },
  Media_url: { type: String },
  Interaction: {
    Like: [{ type: String }],
    Share: [{ type: String }],
  },
  CreateAt: { type: Date },
  User_create_id: { type: Schema.Types.ObjectId },
});

module.exports = mongoose.model("Post", PostSchema);
