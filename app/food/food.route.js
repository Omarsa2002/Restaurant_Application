
const express = require('express');
const {body} = require('express-validator');
const router = express.Router();
const foodController = require('./foodControl');


router.get('/allfood', foodController.getAllFood);

router.get('/getfood/:foodId', foodController.getFood);

module.exports = router;
