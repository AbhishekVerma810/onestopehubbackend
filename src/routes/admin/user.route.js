const express = require('express');
const userRouter = express.Router();
const UserController = require("../../controller/admin/user.controller.js");
const multer = require('../../middleware/file.upload.js');
const singleImage = multer.upload.single("profile_picture");
const productPictures = multer.upload.fields([{ name: 'product_picture', maxCount: 1 }, { name: 'invoice', maxCount: 1 },{ name: 'shop_picture', maxCount: 1 }]);
const adminAuth = require('../../middleware/admin.auth');

userRouter.get("/list",adminAuth,UserController.getUserList);
userRouter.get("/edit/:id",adminAuth,UserController.editUser);
userRouter.post("/update/:id",adminAuth,singleImage,UserController.updateUser);
userRouter.get("/delete/:id",adminAuth,UserController.deleteUser);
userRouter.get("/block/:id",adminAuth,UserController.blockUser);
userRouter.get("/product/detail/:id",adminAuth,UserController.getUserProductDetails);
userRouter.get("/product/edit/:id",adminAuth,UserController.editUserProduct);
userRouter.post("/product/update/:id",adminAuth,productPictures,UserController.updateUserProduct);
userRouter.get("/product/delete/:id",adminAuth,UserController.deleteUserProduct);

module.exports = userRouter