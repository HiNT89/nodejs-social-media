const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares");
const userController = require("../controllers/user.controller");
router.get("/profile/:userID", [authJwt.verifyToken], userController.profile);
router.patch("/add-friend", [authJwt.verifyToken], userController.addFriend);
router.patch("/unfriend", [authJwt.verifyToken], userController.deleteFriend);
router.get("/friends", [authJwt.verifyToken], userController.friends);
router.patch(
  "/update-password",
  [authJwt.verifyToken],
  userController.updatePassword,
);
router.patch(
  "/update-info",
  [authJwt.verifyToken],
  userController.updateInformation,
);
router.patch(
  "/update-profile",
  [authJwt.verifyToken],
  userController.updateProfile,
);
router.get("/", [authJwt.verifyToken], userController.index);

module.exports = router;
