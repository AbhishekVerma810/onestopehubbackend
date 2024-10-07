const helper = require("../utils/helper");
const {Admin} = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

module.exports = async (req, res, next) => {
  try {
    let token = helper.getcookieAdmin(req);
    // console.log("token",token);
    if (token) {
      decodedToken = jwt.verify(token, process.env.SECRET);
      if (decodedToken) {
        // console.log("decodedToken",decodedToken);
        let admin = await Admin.findOne({
          where: { id: decodedToken.id }
        });
        // return res.send(admin);
        // console.log("admin--------------------", admin);
        if (admin) {
          // console.log("admin",admin);
          req.admin = admin;
          return next();
        } else {
          console.log("No admin found");
        }
      } else {
        console.log("Invalid token provided.");
      }
      return next();
    } else {
      const { error, message, formValue } = req.query;
      console.log("Undefined token");
      return res.render("admin/auth/login.ejs", { error, message, formValue });
    }
  } catch (error) {
    next(error);
  }
};
