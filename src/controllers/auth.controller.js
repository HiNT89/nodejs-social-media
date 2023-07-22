const db = require("../models");
const config = require("../config/auth.config");
const {
  user: User,
  role: Role,
  refreshToken: RefreshToken,
  message: Message,
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
      imageURL,
      phoneNumber,
      gender,
      birthday,
    } = req.body;
    const user = new User({
      username: username ?? null,
      email: email,
      password: password ? bcrypt.hashSync(password, 8) : null,
      createdAt: new Date(),
      middleName,
      firstName,
      imageURL,
      gender,
      lastName,
      phoneNumber,
      birthday,
      followers: [],
      friends: [],
      followings: [],
    });
    const message = new Message({
      listBoxMessage: [],
    });

    await message
      .save()
      .then((data) => {
        user.messageID = data._id;
      })
      .catch(next);
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
              res.json(data);
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
              const response = data._doc;
              res.json({ ...response, password: "*******" });
            }) // test show all data
            .catch(next);
        })
        .catch(next);
    }
  }
  //
  signin(req, res, next) {
    const { username, password } = req.body;
    User.findOne({
      username: username,
    })
      .populate("roles", "-__v")
      .exec()
      .then(async (user) => {
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
        var passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!",
          });
        }

        const token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: config.jwtExpiration, // 1p
        });
        let refreshToken = await RefreshToken.createToken(user);
        var authorities = [];

        for (let i = 0; i < user.roles.length; i++) {
          authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        const {
          middleName,
          firstName,
          lastName,
          imageURL,
          phoneNumber,
          gender,
          birthday,
        } = user;
        res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
          refreshToken: refreshToken,
          middleName,
          firstName,
          lastName,
          imageURL,
          phoneNumber,
          gender,
          birthday,
        });
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
