const mongoose = require("mongoose");

const { Schema, ObjectId } = mongoose;

const MessageSchema = new Schema({
  Array_user_id: [{ type: Schema.Types.ObjectId }],
});

const Message_itemSchema = new Schema({
  Message: { type: Schema.Types.ObjectId },
  Content: { type: String },
  CreateAt: { type: Date },
});

module.exports = mongoose.model("Message_item", Message_itemSchema);
module.exports = mongoose.model("Message", MessageSchema);
