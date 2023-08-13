const db = require("../models");
const {
  user: User,
  information: Information,
  profile: Profile,
  message: Message,
} = db;
const bcrypt = require("bcryptjs");
class UserController {
  index(req, res, next) {
    const id = req.userID;

    Information.findById(id).then((dataRes) => {
      res.status(200).json(dataRes);
    });
  }
  friends(req, res, next) {
    const id = req.userID;
    User.findById(id)
      .populate("friends")
      .then((dataRes) => {
        res.status(200).json(dataRes);
      });
  }
  async updatePassword(req, res, next) {
    const id = req.userID;
    const { password, newPassword } = req.body;
    if (!password || !newPassword)
      return res.status(400).send("data not validate");
    try {
      const user = await User.findById(id);
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({
          message: "Invalid Password!",
        });
      }
      user.password = bcrypt.hashSync(newPassword, 8);
      user
        .save()
        .then(() => res.status(201).send("success"))
        .catch((e) => res.status(400).send(e));
    } catch (e) {
      res.status(400).send(e);
    }
  }
  async updateInformation(req, res, next) {
    const id = req.userID;
    const payload = req.body;
    const listKeysValidate = [
      "middleName",
      "firstName",
      "lastName",
      "gender",
      "avatar",
      "birthday",
      "phoneNumber",
    ];
    const keys = Object.keys(payload);
    keys.forEach((it) => {
      const checkPayload = listKeysValidate.includes(it);
      if (!checkPayload) {
        return res.status(400).send({ massage: "payload error" });
      }
    });
    try {
      const information = await Information.findById(id);
      const keys = Object.keys(payload);
      const values = Object.values(payload);
      keys.forEach((key, index) => {
        information[key] = values[index];
      });
      information
        .save()
        .then(() =>
          res.status(200).send({ massage: "update information success" }),
        )
        .catch((e) => res.status(400).send({ massage: e }));
    } catch (e) {
      res.status(400).send({ massage: e });
    }
  }
  async updateProfile(req, res, next) {
    const id = req.userID;
    const payload = req.body;
    const listKeysValidate = ["thumbnail", "listPost", "description", ,];
    const keys = Object.keys(payload);
    keys.forEach((it) => {
      const checkPayload = listKeysValidate.includes(it);
      if (!checkPayload) {
        return res.status(400).send({ massage: "payload error" });
      }
    });
    try {
      const profile = await Profile.findById(id);
      const keys = Object.keys(payload);
      const values = Object.values(payload);
      keys.forEach((key, index) => {
        profile[key] = values[index];
      });
      profile
        .save()
        .then(() => res.status(200).send({ massage: "update profile success" }))
        .catch((error) => res.status(400).send({ massage: error }));
    } catch (e) {
      res.status(400).send({ massage: e });
    }
  }
  async addFriend(req, res, next) {
    const { users } = req.body;

    if (users.length !== 2) return res.status(400).send("error");
    try {
      const userRes = await User.find({ _id: { $in: users } });
      const message = new Message({
        users: [userRes[0]._id, userRes[1]._id],
        message: [],
      });
      const messageRes = await message.save();
      const user1 = userRes[0];
      const user2 = userRes[1];
      const checkUser1 = user1.friends.find(
        (it) => it.toString() === user2._id.toString(),
      );
      const checkUser2 = user2.friends.find(
        (it) => it.toString() === user1._id.toString(),
      );
      if (!checkUser1) {
        user1.friends.push(user2._id);
        user1.messageID.push(messageRes._id);
      }
      if (!checkUser2) {
        user2.friends.push(user1._id);
        user2.messageID.push(messageRes._id);
      }

      try {
        await user1.save();
        await user2.save();
        res.status(200).send("add friend success");
      } catch (e) {
        res.status(500).send(e);
      }
    } catch (e) {
      res.status(500).send(e);
    }
  }
  async deleteFriend(req, res, next) {
    const { users, messageID } = req.body;
    if (users.length !== 2 || !messageID) return res.status(400).send("error");
    try {
      await Message.deleteOne({ _id: messageID });
      const userRes = await User.find({ _id: { $in: users } });
      const user1 = userRes[0];
      const user2 = userRes[1];
      const checkUser1 = user1.friends.find(
        (it) => it.toString() === user2._id.toString(),
      );
      const checkUser2 = user2.friends.find(
        (it) => it.toString() === user1._id.toString(),
      );
      if (checkUser1) {
        user1.friends = user1.friends.filter(
          (i) => i.toString() !== user2._id.toString(),
        );
        user1.messageID = user1.messageID.filter(
          (x) => x.toString() !== messageID.toString(),
        );
      }
      if (checkUser2) {
        user2.friends = user1.friends.filter(
          (i) => i.toString() !== user1._id.toString(),
        );
        user2.messageID = user1.messageID.filter(
          (x) => x.toString() !== messageID.toString(),
        );
      }

      try {
        await user1.save();
        await user2.save();
        res.status(200).send("unfriend success");
      } catch (e) {
        res.status(500).send(e);
      }
    } catch (e) {
      res.status(500).send(e);
    }
  }
  async profile(req, res, next) {
    const userID = req.params.userID;
    try {
      const profileRes = await Profile.findById(userID)
        .populate("listPost")
        .populate("_id");
      const userRes = await User.findById(userID);
      const result = {
        ...profileRes._doc,
        email: userRes.email,
        friends: userRes.friends,
      };
      res.status(200).json(result);
    } catch (e) {
      res.send(e);
    }
  }
}
module.exports = new UserController();
