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

module.exports = {
    getAllFood,
    getFood
}