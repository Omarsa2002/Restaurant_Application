const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken.js');
const { myMullter, HME } = require('../utils/multer.js');
const rateLimiter = require("../utils/rate.limit.js");
const chefCon = require('./chefController.js');

router.put('/updatechefprofile', verifyToken, myMullter().fields([{ name: "image", maxCount: 1 }]), HME, chefCon.updateChefProfile);
router.post('/addfood', verifyToken,  myMullter().fields([{ name: "image", maxCount: 1 }]), HME, chefCon.addFood);
router.get('/cheffood', verifyToken, chefCon.chefFood);
router.put('/updatefood/:foodId', verifyToken,  myMullter().fields([{ name: "image", maxCount: 1 }]), HME, chefCon.updateFood);
router.get('/chefdata', verifyToken, chefCon.chefData);
router.delete('/deletefood/:foodId', verifyToken, chefCon.deleteFood);

module.exports = router;
