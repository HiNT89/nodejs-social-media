const db = require("../models");
const User = db.user;

class userFunction {
  findUser = async (id) => {
    let result;
    await User.findById(id)
      .then((user) => {
        result = user ? user : null;
        delete result.password;
      })
      .catch(() => {
        result = false;
      });
    return result;
  };
  findListUser = async (ids) => {
    let result;
    await User.find({ _id: ids })
      .then((listUser) => {
        result = listUser ? listUser : null;
        result = result.map((user) => {
          delete user.password;
          return user;
        });
      })
      .catch(() => {
        result = false;
      });
    return result;
  };
}

module.exports = new userFunction();
// 64ba51f85a370c624def5aa3
// 64ba525e5a370c624def5aac
// 64ba52765a370c624def5ab1