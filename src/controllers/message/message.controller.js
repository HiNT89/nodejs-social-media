const db = require("../../models");
const Message = db.message;
class MessageController {
  //
  get(req, res, next) {
    const id = req.params.messageID;
    Message.findById(id)
      .then((data) => res.status(200).json(data))
      .catch(next);
  }
  //
  create(req, res, next) {
    const message = new Message({
      listBoxMessage: [],
    });
    message
      .save()
      .then((data) => res.status(200).json(data))
      .catch(next);
  }
  async update(messageID, messageDetailID) {
    const messageItem = await Message.findById(messageID)
      .then((message) => (message ? message : false))
      .catch(() => false);
    if (messageItem) {
      await messageItem.listBoxMessage.push(messageDetailID);
      const result = await messageItem
        .save()
        .then((data) => res.status(200).json(data))
        .catch(() => false);
      return result;
    } else {
      return false;
    }
  }
}

module.exports = new MessageController();
