const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const messageDetailSchema = new Schema({
  users: { type: [{ type: ObjectId }] },
  messageContent: {
    type: [
      {
        type: {
          createAt: { type: Date, default: new Date() },
          userID: { type: ObjectId },
          reply: {
            type: ObjectId || null,
          },
          content: { type: String },
        },
      },
    ],
  },
});

module.exports = mongoose.model("MessageDetail", messageDetailSchema);
