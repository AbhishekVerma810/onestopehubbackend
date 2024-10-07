const express = require('express');
const authUserRouter = express.Router();
const AuthController = require("../../controller/api/auth.controller.js");
const multer = require('../../middleware/file.upload.js');
const userAuth = require('../../middleware/user.auth.js');
const singleImage = multer.upload.single("img_url");
// const { upload } = require('../../middleware/file.upload.js');

authUserRouter.post("/send-otp",AuthController.sendOTP);
authUserRouter.post("/verify-otp",AuthController.verifyOTP);
authUserRouter.post("/add-personal-details",AuthController.addPersonalDetails);
authUserRouter.post("/forget-password",AuthController.forgotPassword);
authUserRouter.post("/verify-otp",AuthController.verifyOTP);
authUserRouter.post("/reset-password",AuthController.resetPassword);

module.exports = authUserRouter;
