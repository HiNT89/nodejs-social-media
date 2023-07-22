const db = require("../../models");
const MessageDetail = db.messageDetail;
const messageController = require("./message.controller");
const userFunction = require("../../utils/user.function");
const handle = require("../../utils/function");
class MessageDetailController {
  // [GET] /message/ => get messageDetail by id
  get(req, res, next) {
    const id = req.params.messageDetailID;
    MessageDetail.findById(id)
      .then(async (messageDetail) => {
        const userConvert = messageDetail.users.map((it) => ({
          _id: it.toString(),
        }));
        const users = await userFunction.findListUser(userConvert);
        const usersRes = users.map((it) => ({
          _id: it._id,
          fullName: handle.matchUsername(it),
          imageURL: it.imageURL,
        }));
        const response = {
          _id: messageDetail._id,
          messageContent: messageDetail.messageContent,
          users: usersRes,
        };
        res.status(200).json(response);
      })
      .catch(next);
  }
  // [POST] => create default messageDetail when create user
  create(req, res, next) {
    const { users, messageID } = req.body;
    const messageDetail = new MessageDetail({
      users,
      messageContent: [],
    });
    messageDetail
      .save()
      .then((data) => messageController.update(messageID, data._id))
      ? res.status(200).send("create message detail success !")
      : res.status(400).send("create message detail error !").catch(next);
  }
  async update(req, res, next) {
    const { userID, content, reply, messageDetailID } = req.body;
    const messageDetailItem = await MessageDetail.findById(messageDetailID)
      .then((result) => result)
      .catch(() => false);
    if (messageDetailItem) {
      const addItem = {
        userID,
        reply: reply ? reply : null,
        content,
      };
      if (
        !messageDetailItem.users
          .map((it) => it.toString())
          .includes(userID.toString())
      ) {
        res.status(401).send("user not found");
        return;
      }
      messageDetailItem.messageContent.push(addItem);
      messageDetailItem
        .save()
        .then(() => res.status(200).send("send message success"))
        .catch(() => res.status(400).send("send message error"));
    } else {
      res.status(400).send("send message error");
    }
  }
}

module.exports = new MessageDetailController();
