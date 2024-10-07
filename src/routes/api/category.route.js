const express = require('express');
const categoryRouter = express.Router();
const CategoryController = require("../../controller/api/category.controller.js");
const multer = require('../../middleware/file.upload.js');
const userAuth = require('../../middleware/user.auth.js');
const singleImage = multer.upload.single("img_url");

categoryRouter.post("/create",singleImage,CategoryController.createCategory);
categoryRouter.get("/list",CategoryController.getCategoryList);

module.exports = categoryRouter;
