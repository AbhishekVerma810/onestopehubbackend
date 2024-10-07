const express = require('express');
const categoryShopServiceRouter = express.Router();
const CategoryShopServiceController = require("../../controller/api/category.shop.service.controller.js");
const multer = require('../../middleware/file.upload.js');
const userAuth = require('../../middleware/user.auth.js');
const singleImage = multer.upload.single("img_url");

categoryShopServiceRouter.post("/create",CategoryShopServiceController.createCategoryShopService);
categoryShopServiceRouter.get("/list",CategoryShopServiceController.getCategoryShopServiceList);
categoryShopServiceRouter.get("/list/:id",CategoryShopServiceController.getParticularCategoryShopList);

module.exports = categoryShopServiceRouter;
