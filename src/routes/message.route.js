const messageController = require("../controllers/message.controller");
const express = require("express");
const { authJwt } = require("../middlewares");
const router = express.Router();
router.post("/send", [authJwt.verifyToken], messageController.send);
router.get("/:messageID", [authJwt.verifyToken], messageController.index);
router.get("/", [authJwt.verifyToken], messageController.listMessage);
module.exports = router;
