const db = require("../models");
const User = db.user;
const userFunction = require("../utils/user.function");
const { matchUsername } = require("../utils/function");
class UserController {
  // get profile user
  async profileUser(req, res, next) {
    const id = req.params.userID;
    console.log("call api");
    let userData;
    const dataUser = await userFunction
      .findUser(id)
      .then((user) => {
        userData = user;
        return userFunction.findListUser(user.friends);
      })
      .then((listUser) => {
        userData.friends = userData.friends.map((it) => {
          const item = listUser.filter(
            (x) => x._id.toString() === it.toString(),
          )[0];
          return {
            userID: it,
            fullName: matchUsername(item),
            isOnline: true,
            imageURL: item.imageURL,
          };
        });
        res.status(200).json(userData);
      });
  }

  // get list profile user
  async listProfileUser(req, res, next) {
    const ids = req.body.listUserID;
    const dataUser = await userFunction.findListUser(ids);
    res.status(200).json(dataUser);
  }
  // update user [PATCH] /user/update/:userID
  async update(req, res, next) {
    const id = req.params.userID;
    const payload = req.body.payload; // payload : {id,lastName,middleName,firstName,birthday,gender,imageURL,follower,following,friends,phoneNumber} role ??
    const user = await userFunction.findUser(id);
    user.lastName = payload.lastName;
    user.middleName = payload.middleName;
    user.firstName = payload.firstName;
    user.birthday = payload.birthday;
    user.gender = payload.gender;
    user.imageURL = payload.imageURL;
    user.follower = payload.follower;
    user.following = payload.following;
    user.friends = payload.friends;
    user.phoneNumber = payload.phoneNumber;

    user.save().then((data) => {
      delete data.password;
      res.status(200).json(data);
    });
  }
  // --------
  all(req, res, next) {
    res.status(200).send("Public Content.");
  }
  //
  user(req, res, next) {
    res.status(200).send("User Content.");
  }
  admin(req, res, next) {
    res.status(200).send("Admin Content.");
  }
  moderator(req, res, next) {
    res.status(200).send("Moderator Content.");
  }
}
module.exports = new UserController();
