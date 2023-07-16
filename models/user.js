const mongoose = require("mongoose");

const { Schema, ObjectId } = mongoose;

const UserSchema = new Schema({
  Type_account: { type: String },
  CreateAt: { type: Date },
});

const User_detailSchema = new Schema({
  First_name: { type: String },
  Middle_name: { type: String },
  Last_name: { type: String },
  Phone_number: { type: String },
  Email: { type: String },
  Birthday: { type: String },
  Facebook: { type: String },
  Gender: { type: String },
  Avatar_Url: { type: String },
});

module.exports = mongoose.model("User_detail", User_detailSchema);

module.exports = mongoose.model("User", UserSchema);
