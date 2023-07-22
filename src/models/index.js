const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
// user
db.refreshToken = require("./refreshToken.model");
db.user = require("./user.model");
// post
db.post = require("./post.model");
// comment
db.comment = require("./comment/comment.model");
db.commentDetail = require("./comment/commentDetail.model");
// message
db.message = require("./message/message.model");
db.messageDetail = require("./message/messageDetail.model");
//role
db.role = require("./role.model");
db.ROLES = ["user", "admin", "moderator"];
module.exports = db;
