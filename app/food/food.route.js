
const express = require('express');
const {body} = require('express-validator');
const router = express.Router();
const foodController = require('./foodControl');


router.get('/allfood', foodController.getAllFood);
router.post('/addfood', [
    body('title')
        .notEmpty()
        .withMessage("title is empty")
        .isLength({ min: 2 })
        .withMessage("title is less than 2 characters"),
    body('description')
        .notEmpty()
        .withMessage("description is empty")
        .isLength({ min: 2 })
        .withMessage("description is less than 2 characters"),
    body('price')
        .notEmpty()
        .withMessage("price is required")
], foodController.addFood);

router.get('/getfood/:foodId', foodController.getFood);
router.patch('/updatefood/:foodId', [
    body('title')
        .notEmpty()
        .withMessage("title is empty")
        .isLength({ min: 2 })
        .withMessage("title is less than 2 characters"),
    body('description')
        .notEmpty()
        .withMessage("description is empty")
        .isLength({ min: 2 })
        .withMessage("description is less than 2 characters"),
    body('price')
        .notEmpty()
        .withMessage("price is required")
], foodController.updateFood);
router.delete('/deletefood/:foodId', foodController.deleteFood);

module.exports = router;
