const mongoose = require("mongoose");

const { Schema, ObjectId } = mongoose;

const MessageSchema = new Schema({
  users: [{ type: ObjectId, ref: "Information" }],
  message: [
    {
      content: { type: String },
      createdAt: { type: Date },
      reply: { type: ObjectId || null },
      userID: { type: ObjectId, ref: "Information" },
    },
  ],
});

module.exports = mongoose.model("Message", MessageSchema);
