// express
const express = require("express");
const app = express();
app.use(express.json());
// mongoose
const mongoose = require("mongoose");
// dotenv : manage file .env
require("dotenv").config();
// database
const initial = require("./utils/createRole");
const mongoString = process.env.DATABASE_URL;

mongoose
  .connect(mongoString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial.index();
  })
  .catch((err) => {
    console.error("Connection error", err);
  });
// body parser
const bp = require("body-parser");
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
// cors
const cors = require("cors");
var corsOptions = {
  origin: [
    `http://localhost:${process.env.PORT}`,
    `http://localhost:3000}`,
    "https://nodejs-social-media-iota.vercel.app",
  ],
};
app.use(cors(corsOptions));
// router

app.get("/", (req, res) => {
  res.send("welcome to project social-media by hint");
});

const routes = require("./routes");
routes(app);
app.listen(process.env.PORT, () => {
  console.log(`server started port ${process.env.PORT}`);
});
