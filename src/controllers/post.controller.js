const db = require("../models");
const { matchUsername } = require("../utils/function");
const { post: Post, user: User, comment: Comment } = db;
const commentController = require("./comment/comment.controller");
const { findListCommentDetail } = require("./../utils/comment.function");
const { findListUser } = require("../utils/user.function");
class PostController {
  // [GET] /post/profile/:userID => get list post by user create
  getPostsUserID(req, res, next) {}
  // [GET] /post/feed/:userID
  getFeedUserID(req, res, next) {}
  // [GET] /post => get all post
  index(req, res, next) {
    const { _page, _limit } = req.query;
    let dataPost;
    Post.find({ isRemove: false })
      .then((data) => {
        const userCreateIds = data.reduce((array, item) => {
          const { like, share } = item.interaction;
          return [...array, item.userCreateId, ...like, ...share];
        }, []);
        dataPost = data;
        return findListUser(userCreateIds);
      })
      .then((listUser) => {
        if (!listUser) {
          res.status(400).send("user not found");
        }
        const response = dataPost.map((post) => {
          const {
            description,
            type,
            mediaUrl,
            interaction,
            createAt,
            commentID,
            userCreateId,
          } = post;
          const user = listUser.filter(
            (user) => user._id.toString() === userCreateId.toString(),
          )[0];

          const { like, share } = interaction;
          if (like.length) {
            result.like = like.map(async (it) => {
              const userData = await listUser.filter(
                (x) => x._id.toString() === it.toString(),
              )[0];
              return {
                userID: it,
                username: matchUsername(userData),
                imageURL: userData.imageURL,
              };
            });
          }
          if (share.length) {
            result.share = share.map(async (it) => {
              const userData = await listUser.filter(
                (x) => x._id.toString() === it.toString(),
              )[0];
              return {
                userID: it,
                username: matchUsername(userData),
                imageURL: userData.imageURL,
              };
            });
          }

          return {
            username: matchUsername(user),
            imageURL: user.imageURL,
            userID: userCreateId,
            createdAt: createAt,
            typeFeed: type,
            description,
            mediaURL: mediaUrl,
            commentID,
            interaction: interaction,
          };
        });
        if (!_page || !_limit) {
          res.status(200).json(response);
          return;
        }

        if (!_page || !_limit) {
          res.status(200).json(data);
          return;
        }

        const totalPage = Math.ceil(response.length / _limit);
        if (_page > totalPage || _page < 1) {
          res.status(400).send("page not found");
          return;
        }
        if (_limit < 1 || _limit > response.length) {
          res.status(400).send("limit not error");
          return;
        }
        res
          .status(200)
          .json(response.slice((_page - 1) * _limit, _page * _limit));
      })
      .catch(next);
  }
  // [GET] /post/:postID => get post by post ID
  getPostID(req, res, next) {
    const id = req.params.postID;
    let postItem;
    Post.findById(id)
      .then((data) => {
        postItem = data;
        console.log(data.commentID);
        return Comment.findById(data.commentID);
      })
      .then((objectComment) => findListCommentDetail(objectComment.listComment))
      .then((listCMTDetail) => {
        res.status(200).json({ ...postItem._doc, listComment: listCMTDetail });
        return;
      })
      .catch(next);
  }
  // [POST] /post/create => create new post
  async create(req, res, next) {
    const commentID = await commentController.createComment();
    const { description, userCreateId, mediaUrl, type } = req.body;
    const post = new Post({
      description,
      type,
      mediaUrl,
      interaction: {
        like: [],
        share: [],
      },
      remove: false,
      createAt: new Date(),
      userCreateId: userCreateId,
      commentID,
    });
    post
      .save()
      .then((data) => {
        const dataPost = data;
        res.status(200).json(dataPost);
      })
      .catch(next);
  }
  // [PATCH] /post/update/:postID => update post
  update(req, res, next) {
    try {
      const id = req.params.postID;
      const updatedData = req.body;
      Post.findById(id)
        .then((result) => {
          const arrKey = Object.keys(updatedData);
          arrKey.forEach((key) => (result[key] = updatedData[key]));
          return result.save();
        })
        .then((data) => res.json(data))
        .catch(next);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  // [DELETE] /post/delete/:postID => delete post
  delete(req, res, next) {
    const id = req.params.postID;
    Post.findByIdAndRemove(id)
      .then(() => res.send("delete success !"))
      .catch((err) => res.send(err));
  }
  // [Delete] /post/remove/:postID => soft delete post
  remove(req, res, next) {
    const id = req.params.postID;
    Post.findById(id)
      .then((result) => {
        result.isRemove = true;
        return result.save();
      })
      .then(() => res.send("remove success !"))
      .catch(next);
  }
}

module.exports = new PostController();

// if (data.comment) {
//   const dataComment = commentController
//     .getComment(data.comment)
//     .then((dataComment) => dataComment)
//     .catch(next);
//   const dataRes = {
//     ...data,
//     comment: dataComment,
//   };
//   res.json(dataRes);
// } else {
//   res.json(data);
// }
