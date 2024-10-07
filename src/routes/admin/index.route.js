const express = require('express');
var router = express.Router();
const authAdminRouter = require('./auth.route');
const userRouter =  require('./user.route');


/* ========================== admin auth routes ========================= */

router.use('/auth', authAdminRouter);

router.use('/user', userRouter);

module.exports = router;