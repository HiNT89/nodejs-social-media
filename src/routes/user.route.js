const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares");
const userController = require("../controllers/user.controller");

router.get("/listProfile", userController.listProfileUser);
router.get("/:userID", userController.profileUser);
router.post("/update/:userID", userController.update);
// router.get("/all", userController.all);
// router.get("/user", [authJwt.verifyToken], userController.user);
// router.get(
//   "/admin",
//   [authJwt.verifyToken, authJwt.isAdmin],
//   userController.admin,
// );
// router.get(
//   "/moderator",
//   [authJwt.verifyToken, authJwt.isModerator],
//   userController.moderator,
// );
module.exports = router;
