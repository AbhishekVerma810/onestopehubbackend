const express = require('express');
var router = express.Router();
const authUserRouter = require('./auth.route.js');
const userRouter = require('./user.route.js');
const bannerRouter =  require('./banner.route.js');
const categoryRouter =  require('./category.route.js');
const categoryShopRouter = require('./category.shop.route.js');
const categoryShopServiceRouter = require('./category.shop.service.route.js');
const categoryShopServiceItemRouter = require('./category.shop.service.route.js');

/* ===================== api user auth routes ==================== */
router.use('/auth', authUserRouter);

/* ========================== user routes ========================= */
router.use('/user', userRouter);

/* ========================== banner routes ========================= */
router.use('/banner', bannerRouter);

/* ========================== banner routes ========================= */
router.use('/category', categoryRouter);

/* ========================== category shop routes ========================= */
router.use('/category/shop', categoryShopRouter);

/* ========================== category shop service routes ========================= */
router.use('/category/shop/service', categoryShopServiceRouter);

/* ========================== category shop service routes ========================= */
router.use('/category/shop/service/item', categoryShopServiceItemRouter);


module.exports = router;