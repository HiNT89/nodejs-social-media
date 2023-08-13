const mongoose = require("mongoose");

const { Schema, ObjectId } = mongoose;

const UserSchema = new Schema({
  username: { type: String },
  password: { type: String },
  messageID: [{ type: ObjectId, ref: "Message" }],
  roles: [{ type: ObjectId, ref: "Role" }],
  createdAt: { type: Date },
  friends: [{ type: ObjectId, ref: "Information" }],
  email: { type: String },
});
module.exports = mongoose.model("User", UserSchema);
