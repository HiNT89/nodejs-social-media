const db = require("../models");
const { message: Message, user: User } = db;
class MessageController {
  async index(req, res, next) {
    const id = req.userID;
    const messageID = req.params.messageID;
    try {
      const messageRes = await Message.findById(messageID).populate("users");
      const checkUser = messageRes.users
        .map((it) => it._id.toString())
        .includes(id);
      if (!checkUser) return res.send("user not found");
      res.status(200).json(messageRes);
    } catch (e) {
      res.send(e);
    }
  }
  async send(req, res, next) {
    const id = req.userID;
    const payload = req.body;
    const listKeysValidate = ["content", "reply", "messageID"];
    const keys = Object.keys(payload);
    keys.forEach((it) => {
      const checkPayload = listKeysValidate.includes(it);
      if (!checkPayload) {
        return res.status(400).send({ massage: "payload error" });
      }
    });
    const { content, reply, messageID } = payload;
    const messageNewItem = {
      content,
      createdAt: new Date(),
      reply: reply ? reply : null,
      userID: id,
    };
    try {
      const messageRes = await Message.findById(messageID);
      let arrMessage = messageRes.message;
      if (!messageRes.users.includes(id))
        res.status(400).send("error user not found message");
      messageRes.message = [...arrMessage, messageNewItem];

      await messageRes
        .save()
        .then(() => res.status(200).send("send message success"))
        .catch((e) => {
          res.send(e);
        });
    } catch (e) {
      res.status(400).send(e);
    }
  }
  async listMessage(req, res, next) {
    const userID = req.userID;
    try {
      const userRes = await User.findById(userID)
        .populate("messageID")
        .populate("friends");
      const listBoxMessage = userRes.messageID;
      const newListBoxMessage = await listBoxMessage.map((it) => {
        const listMessage = it.message;
        const result = {
          ...it._doc,
          message: listMessage[listMessage.length - 1],
        };
        return { ...it, _doc: result };
      });
      userRes.messageID = await newListBoxMessage;
      res.status(200).json(userRes);
    } catch (e) {
      res.status(400).send(e);
    }
  }
}
module.exports = new MessageController();
