const express = require('express');
const bannerRouter = express.Router();
const BannerController = require("../../controller/api/banner.controller.js");
const multer = require('../../middleware/file.upload.js');
const userAuth = require('../../middleware/user.auth.js');
const singleImage = multer.upload.single("img_url");
// const { upload } = require('../../middleware/file.upload.js');

bannerRouter.post("/create",singleImage,BannerController.createBanner);
bannerRouter.get("/list",BannerController.getBannerList);
// menuRouter.get("/view/:id",userAuth,BannerController.);

module.exports = bannerRouter;
