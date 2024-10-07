const express = require('express');
const authAdminRouter = express.Router();
const AuthController = require("../../controller/admin/auth.controller");
const adminAuth = require('../../middleware/admin.auth');

authAdminRouter.get("/login",AuthController.getLogin);
authAdminRouter.post("/login",AuthController.login);
authAdminRouter.get("/logout",adminAuth,AuthController.logout);
authAdminRouter.get('/forgot-password', AuthController.getForgotPassword);
authAdminRouter.get("/reset-password", AuthController.resetPassword);
authAdminRouter.post('/forgot-password', AuthController.adminForgotPassword);
authAdminRouter.post("/reset-password", AuthController.adminResetPassword);
authAdminRouter.post("/switch-language",adminAuth,AuthController.switchLanguage);

module.exports = authAdminRouter;
