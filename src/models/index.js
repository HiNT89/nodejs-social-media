const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
// user
db.user = require("./user.model");
db.information = require("./information.model");
db.profile = require("./profile.model");
// post
db.post = require("./post.model");
// comment
db.comment = require("./comment.model");
// message
db.message = require("./message.model");
// refresh token
db.refreshToken = require("./refreshToken.model");
//role
db.role = require("./role.model");
db.ROLES = ["user", "admin", "moderator"];
module.exports = db;
