const mongoose = require("mongoose");

const { Schema, ObjectId } = mongoose;

const ProfileSchema = new Schema(
  {
    _id: { type: ObjectId, ref: "Information" },
    thumbnail: { type: String },
    description: { type: String },
    listPost: [{ type: ObjectId,ref : "Post" }],
  },
  { _id: false },
);

module.exports = mongoose.model("Profile", ProfileSchema);
