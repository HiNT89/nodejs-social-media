const postRouter = require("./post.route");
const commentRouter = require("./comment.route");
const messageRouter = require("./message.route");
const authRouter = require("./auth.route");
const userRouter = require("./user.route");
function route(app) {
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/comment", commentRouter);
  app.use("/api/message", messageRouter);
  app.use("/api/post", postRouter);
}
module.exports = route;
