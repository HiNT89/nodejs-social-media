const mongoose = require("mongoose");

const { Schema, ObjectId } = mongoose;

const InformationSchema = new Schema(
  {
    _id: { type: ObjectId, ref: "User" },
    middleName: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String },
    avatar: { type: String },
    birthday: { type: Date },
    phoneNumber: { type: String },
  },
  { _id: false },
);
InformationSchema.index({
  middleName: "text",
  lastName: "text",
  firstName: "text",
});
module.exports = mongoose.model("Information", InformationSchema);
