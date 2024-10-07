const express = require('express');
const userRouter = express.Router();
const userAuth = require('../../middleware/user.auth.js');
const UserController = require('../../controller/api/user.controller.js');
const multer = require('../../middleware/file.upload.js');
const userController = require('../../controller/admin/user.controller.js');
const singleImage = multer.upload.single("profile_picture");

userRouter.get('/profile',userAuth,UserController.profileDetails);
userRouter.post('/update/profile',userAuth,singleImage,UserController.updateUserProfile);
userRouter.delete('/profile',userAuth,UserController.deleteUserProfile);
userRouter.post('/change-email',userAuth,UserController.changeEmail);
userRouter.post('/update-password',userAuth,UserController.updatePassword);
userRouter.post('/create-feedback', userAuth,UserController.createFeedback);
userRouter.get('/faq/all', userAuth,UserController.getAllFaq);
module.exports = userRouter;
