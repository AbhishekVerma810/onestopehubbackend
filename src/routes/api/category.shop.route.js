const express = require('express');
const categoryShopRouter = express.Router();
const CategoryShopController = require("../../controller/api/category.shop.controller.js");
const multer = require('../../middleware/file.upload.js');
const userAuth = require('../../middleware/user.auth.js');
const singleImage = multer.upload.single("img_url");

categoryShopRouter.post("/create",singleImage,CategoryShopController.createCategoryShop);
categoryShopRouter.get("/list",CategoryShopController.getCategoryShopList);
categoryShopRouter.get("/list/:id",CategoryShopController.getParticularCategoryShopList);

module.exports = categoryShopRouter;
