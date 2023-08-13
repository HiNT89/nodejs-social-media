const db = require("../models");
const { user: User, commentDetail: CommentDetail } = db;
const userFunction = require("./user.function");
const { matchUsername } = require("./function");
class commentFunction {
  findCommentDetail = async (id) => {
    let result;
    await CommentDetail.findById(id)
      .then(async (dataCommentDetail) => {
        const user = await userFunction.findUser(
          dataCommentDetail.userID.toString(),
        );
        result = {
          ...dataCommentDetail._doc,
          fullName: matchUsername(user),
          imageURL: user.imageURL,
        };
      })
      .catch(() => {
        result = false;
      });

    return result;
  };

  findListCommentDetail = async (ids) => {
    let result;
    let listCommentDetail = [];
    let listUser = [];
    await CommentDetail.find({ _id: ids })
      .then(async (dataListCommentDetail) => {
        listCommentDetail = dataListCommentDetail;
        const userIDs = dataListCommentDetail.map((it) => it.userID.toString());
        return User.find({ _id: userIDs });
      })
      .then((dataListUser) => {
        listUser = dataListUser;
        result = listCommentDetail.map((commentDetail) => {
          const user = listUser.filter(
            (user) => user._id.toString() === commentDetail.userID.toString(),
          )[0];
          return {
            ...commentDetail._doc,
            fullName: matchUsername(user),
            imageURL: user.imageURL,
          };
        });
      });
    // .catch(() => {
    //   result = false;
    // });

    return result;
  };
}
module.exports = new commentFunction();
