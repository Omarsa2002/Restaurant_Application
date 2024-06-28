const express = require('express');
const router = express.Router();
const authController = require('./authController')
const rateLimiter = require("../utils/rate.limit.js");

//------------user--------------//
router.post('/user/signup', authController.signUp);
router.post('/user/login', authController.login);

//------------chef--------------//
router.post('/chef/signup', authController.chefSignUp);
router.post('/chef/login', authController.chefLogin);

//------------general--------------//
router.get('/confirmemail/:token', authController.verifyEmail);
router.put("/setPassword", authController.setPassword);
router.post("/forgetPassword", authController.forgetPassword);
router.post("/istokenvalid", authController.checkToken)
router.post("/reSendcode", rateLimiter, authController.reSendcode);
router.post("/logout", authController.signOut)


module.exports = router;

