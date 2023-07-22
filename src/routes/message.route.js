const messageController = require("../controllers/message/message.controller");
const messageDetailController = require("../controllers/message/messageDetail.controller");
const express = require("express");
const { authJwt } = require("../middlewares");
const router = express.Router();
router.get("/messageDetail/:messageDetailID", messageDetailController.get);
router.get("/message/:messageID", messageController.get);
router.post("/send", messageDetailController.update);
router.post("/create-message-detail", messageDetailController.create);
router.post("/create-message", messageController.create);
module.exports = router;