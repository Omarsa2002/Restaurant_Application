const Food = require('../db/models/foodModel');
const { validationResult } = require('express-validator');

const getAllFood = async (req, res) => {
    try{
        const query = req.query;
        const limit = query.limit || 4;
        const page = query.page || 1;
        const skip = (page - 1) * limit;
        const food = await Food.find({}, {
            // "__v":false, "_id":0
        }).limit(limit).skip(skip);
        res.json({data:{food}});
    }catch(err){

    }
};

const addFood = async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({ error: errors.array() });
        }
        const newFood = new Food(req.body);
        await newFood.save();
        res.status(201).json({data:{food: newFood}});
    }catch(err){

    }
};

const getFood = async (req, res) => {
    try{
        const food = await Food.findById(req.params.foodId);
        if (!food) {
            return res.status(500).json({ error: errors.array() });
        }
        res.json({data:{food}});
    }catch(err){

    }
};

const updateFood = async (req, res) => {
    try{
        const foodId = req.params.foodId; 
        const updateFood = await Food.updateOne({_id: foodId}, {$set:{...req.body}});
        return res.status(200).json({  msg:"update succesfully" })
        // return res.status(200).json({data:{updateFood}})})
        // await User.updateOne({_id: userId}, {$set:{...req.body}});
        return res.status(200).json({  msg:"update succesfully" })
    }catch(err){

    }
};const deleteFood = async (req, res) => {
    try{
        await Food.deleteOne ({_id: req.params.foodId});
        res.status(200).json({data: null});
    }catch(err){

    }
};

module.exports = {
    addFood,
    getAllFood,
    getFood,
    updateFood,
    deleteFood
}