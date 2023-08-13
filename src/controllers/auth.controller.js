const {
  THUMBNAIL_DEFAULT,
  AVATAR_MEN_DEFAULT,
  AVATAR_WOMEN_DEFAULT,
  AVATAR_OTHER_DEFAULT,
} = require("../utils/constants");
const db = require("../models");
const config = require("../config/auth.config");
const {
  user: User,
  role: Role,
  information: Information,
  profile: Profile,
  refreshToken: RefreshToken,
} = db;
var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
class AuthController {
  // --------
  async signup(req, res, next) {
    const {
      roles,
      username,
      email,
      password,
      middleName,
      firstName,
      lastName,
      phoneNumber,
      gender,
      birthday,
    } = req.body;
    const user = new User({
      username,
      password: bcrypt.hashSync(password, 8),
      messageID: [],
      createdAt: new Date(),
      friends: [],
      email,
    });
    const information = new Information({
      middleName,
      firstName,
      lastName,
      phoneNumber,
      gender,
      birthday,
    });
    if (gender === "male") {
      information.avatar = AVATAR_MEN_DEFAULT;
    } else if (gender === "female") {
      information.avatar = AVATAR_WOMEN_DEFAULT;
    } else {
      information.avatar = AVATAR_OTHER_DEFAULT;
    }
    const profile = new Profile({
      thumbnail: THUMBNAIL_DEFAULT,
      description: "",
      listPost: [],
    });
    if (roles) {
      Role.find({
        name: { $in: roles },
      })
        .exec()
        .then((result) => {
          user.roles = result.map((role) => role._id);
          user
            .save()
            .then((data) => {
              information._id = data._id;
              profile._id = data._id;
              return information.save();
            })
            .then(() => profile.save())
            .then(() => {
              res.status(200).json({ message: "signup success" });
            })
            .catch(next);
        })
        .catch(next);
    } else {
      Role.findOne({
        name: "user",
      })
        .exec()
        .then((result) => {
          user.roles = [result._id];
          user
            .save()
            .then((data) => {
              information.userID = data._id;
              profile.userID = data._id;
              return information.save();
            })
            .then(() => profile.save())
            .then(() => {
              res.status(200).json({ message: "signup success" });
            })
            .catch(next);
        })
        .catch(next);
    }
  }
  //
  signin(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).send("payload not validate");
    let dataUser;
    User.findOne({
      username: username,
    })
      .populate("roles")
      .then(async (user) => {
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!",
          });
        }
        dataUser = user;
        return Information.findOne({
          _id: user._id,
        });
      })
      .then(async (information) => {
        const token = jwt.sign({ id: dataUser._id }, config.secret, {
          expiresIn: config.jwtExpiration, // 1p
        });
        let refreshToken = await RefreshToken.createToken(dataUser);
        var authorities = [];

        for (let i = 0; i < dataUser.roles.length; i++) {
          authorities.push("ROLE_" + dataUser.roles[i].name.toUpperCase());
        }
        const response = {
          accessToken: token,
          refreshToken: refreshToken,
          id: dataUser._id,
          middleName: information.middleName,
          firstName: information.firstName,
          lastName: information.lastName,
          gender: information.gender,
          avatar: information.avatar,
          birthday: information.birthday,
          phoneNumber: information.phoneNumber,
          roles: authorities,
        };
        res.status(200).json(response);
      });
  }
  async refreshToken(req, res) {
    const { refreshToken: requestToken } = req.body;

    if (requestToken == null) {
      return res.status(403).json({ message: "Refresh Token is required!" });
    }

    try {
      let refreshToken = await RefreshToken.findOne({ token: requestToken });

      if (!refreshToken) {
        res.status(403).json({ message: "Refresh token is not in database!" });
        return;
      }

      if (RefreshToken.verifyExpiration(refreshToken)) {
        RefreshToken.findByIdAndRemove(refreshToken._id, {
          useFindAndModify: false,
        }).exec();

        res.status(403).json({
          message:
            "Refresh token was expired. Please make a new signin request",
        });
        return;
      }

      let newAccessToken = jwt.sign(
        { id: refreshToken.user._id },
        config.secret,
        {
          expiresIn: config.jwtExpiration,
        },
      );

      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: refreshToken.token,
      });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  }
}

module.exports = new AuthController();
