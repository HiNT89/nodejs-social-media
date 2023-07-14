const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bp = require("body-parser");
const mongoString = process.env.DATABASE_URL;
const routes = require("./routes/routes");
const app = express();
// connect database
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});
// body parser
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
// router

app.use("/api", routes);

app.listen(3000, () => {
  console.log("server started port 3000");
});
