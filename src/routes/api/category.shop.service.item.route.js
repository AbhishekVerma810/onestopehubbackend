const express = require('express');
const categoryShopServiceItemRouter = express.Router();
const CategoryShopServiceItemController = require("../../controller/api/category.shop.service.controller.js");
const multer = require('../../middleware/file.upload.js');
const userAuth = require('../../middleware/user.auth.js');
const singleImage = multer.upload.single("img_url");

categoryShopServiceItemRouter.post("/create",CategoryShopServiceItemController.createCategoryShopService);
categoryShopServiceItemRouter.get("/list",CategoryShopServiceItemController.getCategoryShopServiceList);

module.exports = categoryShopServiceItemRouter;
