const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;
const UserSchema = new Schema({
  username: String || null,
  email: String,
  password: String || null,
  createdAt: Date,
  middleName: { type: String, default: "" },
  firstName: { type: String, default: "" },
  imageURL: { type: String, default: "" },
  gender: { type: String, default: "" },
  lastName: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  birthday: {
    type: Date,
    default: new Date(),
  },
  messageID: { type: ObjectId },
  followers: [{ type: ObjectId }],
  friends: [{ type: ObjectId }],
  followings: [{ type: ObjectId }],
  roles: [
    {
      type: ObjectId,
      ref: "Role",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
