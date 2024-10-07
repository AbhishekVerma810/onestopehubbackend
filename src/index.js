const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const i18n = require("./middleware/i18n.config");
const session = require("./middleware/session");
const catchGlobalError = require("./middleware/catch.global.error")
const parser = require("./middleware/parser")
const adminRoute = require("./routes/admin/index.route");
const apiRoute = require("./routes/api/index.route");


app.use(cors());
app.use(cookieParser());
app.use(session);
app.use(flash());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"))
app.use("/public", express.static("public/"));
app.use(i18n)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public/"));
app.use(parser);
app.use("/admin", adminRoute);
app.use("/api",apiRoute);

app.get("*", function (req, res) {
  return res.send("hello admin and app api's")
});
app.use(catchGlobalError)
module.exports = app;
