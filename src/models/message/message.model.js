const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const messageSchema = new Schema({
  listBoxMessage: {
    type: [{ type: ObjectId }],
  },
});

module.exports = mongoose.model("Message", messageSchema);
