const db = require("../models");
const { post: Post, information: Information, profile: Profile } = db;
class PostController {
  // [GET] /post
  async index(req, res, next) {
    const { _page, _limit } = req.query;
    let limit = _limit ?? 1;
    let page = _page ?? 1;
    try {
      const posts = await Post.find({ isRemove: false }).populate("userID");

      const totalPage = Math.ceil(posts.length / _limit);
      if (page > totalPage) page = totalPage;
      if (page < 0) page = 1;
      if (limit > posts.length) limit = posts.length;
      if (limit < 0) limit = 1;
      res
        .status(200)
        .json(posts.reverse().slice((page - 1) * limit, page * limit));
    } catch (e) {
      res.status(400).send(e);
    }
  }
  // [GET] /post/:postID => get post by post ID
  getPostID(req, res, next) {
    const id = req.params.postID;
    let dataPostItem;
    if (typeof id !== "string")
      return res.status(400).send("postId not validate");
    Post.findById(id)
      .populate("commentIDs")
      .populate("userID")
      .then((dataRes) => {
        dataPostItem = dataRes._doc;

        const userIDs = dataPostItem.commentIDs.map((it) => it.userID);

        return Information.find({
          _id: { $in: userIDs },
        });
      })
      .then((users) => {
        dataPostItem.commentIDs = dataPostItem.commentIDs.map((it) => {
          const { avatar, firstName, lastName, middleName } = users.filter(
            (x) => x._id.toString() === it.userID.toString(),
          )[0];
          const result = {
            avatar,
            firstName,
            lastName,
            middleName,
            ...it._doc,
          };
          return result;
        });

        res.status(200).json(dataPostItem);
      })
      .catch(next);
  }
  async create(req, res, next) {
    const id = req.userID;
    const { description, mediaURL } = req.body;
    const post = new Post({
      description,
      mediaURL,
      createdAt: new Date(),
      userID: id,
      commentIDs: [],
      type: "public",
      interaction: {
        like: [],
        share: [],
      },
      isRemove: false,
    });
    try {
      const postRes = await post.save();
      const profileRes = await Profile.findById(id);
      profileRes.listPost = [...profileRes.listPost, postRes._id];
      await profileRes.save();
      res.status(200).send({ message: "create post success!!!!" });
    } catch (e) {
      res.send(e);
    }
  }
  // [PATCH] /post/update/:postID => update post
  update(req, res, next) {
    const id = req.params.postID;
    const updatedData = req.body;
    const listKeysValidate = [
      "description",
      "mediaURL",
      "commentIDs",
      "interaction",
      "type",
      "isRemove",
    ];
    const keys = Object.keys(updatedData);
    keys.forEach((it) => {
      const checkPayload = listKeysValidate.includes(it);
      if (!checkPayload) {
        return res.status(400).send({ massage: "payload error" });
      }
    });
    Post.findById(id)
      .then((result) => {
        const arrKey = Object.keys(updatedData);
        arrKey.forEach((key) => (result[key] = updatedData[key]));
        return result.save();
      })
      .then(() => res.send({ message: "update success" }))
      .catch(next);
  }
  // [DELETE] /post/delete/:postID => delete post
  delete(req, res, next) {
    const id = req.params.postID;
    Post.findByIdAndRemove(id)
      .then(() => res.send("delete success !"))
      .catch((err) => res.send(err));
  }
  // [PATCH] /post/remove/:postID => soft delete post
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
  // [GET] /post/search
  // param ?
  search(req, res, next) {
    const { q, _limit } = req.query;
    const limit = _limit ?? 5;
    Post.find({ $text: { $search: q } })
      .then((result) => {
        res.status(200).json(result.slice(0, limit));
      })
      .catch((e) => res.status(400).send(e));
  }
}

module.exports = new PostController();
