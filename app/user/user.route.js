const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken.js');
const { myMullter, HME } = require('../utils/multer.js');
const rateLimiter = require("../utils/rate.limit.js");
const userCon = require('./userControl.js');

router.put('/updateuserprofile', verifyToken, myMullter().fields([{ name: "image", maxCount: 1 }]), HME, userCon.updateUserProfile);
router.get('/userdata', verifyToken, userCon.userData);
router.put("/addtofavourite", verifyToken, userCon.addToFavourite);
router.put("/removefromfavourite", verifyToken, userCon.removeFromFavourite);
router.get("/userfavourite", verifyToken, userCon.userFavourite);


module.exports = router;
