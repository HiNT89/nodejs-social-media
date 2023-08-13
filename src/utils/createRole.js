const db = require("../models");
const { role: Role } = db;

class Initial {
  index() {
    Role.estimatedDocumentCount()
      .then((count) => {
        if (count === 0) {
          new Role({
            name: "user",
          })
            .save()
            .then(() => {
              console.log("success user");
            })
            .catch(() => {
              console.log("error");
            });

          new Role({
            name: "moderator",
          })
            .save()
            .then(() => {
              console.log("success moderator");
            })
            .catch(() => {
              console.log("error");
            });

          new Role({
            name: "admin",
          })
            .save()
            .then(() => {
              console.log("success admin");
            })
            .catch(() => {
              console.log("error");
            });
        }
      })
      .catch();
  }
}
module.exports = new Initial();
