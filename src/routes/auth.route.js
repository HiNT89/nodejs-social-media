const express = require("express");
const router = express.Router();
const { verifySignUp } = require("../middlewares");
const AuthController = require("../controllers/auth.controller");
router.post(
  "/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  AuthController.signup,
);
router.post("/signin", AuthController.signin);
router.post("/refresh-token", AuthController.refreshToken);
module.exports = router;
