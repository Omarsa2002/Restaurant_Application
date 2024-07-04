const { sendResponse, validateExpiry } = require("../utils/util.service");
const CONFIG = require("../../config/config");
const jwt = require("jsonwebtoken");
const constans = require("../utils/constants");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const jwtGenerator = require("../utils/jwt.generator.js");
const bcrypt = require("bcryptjs");
const chefModel = require('../db/models/chefModel.js');
const { imageKit } = require("../utils/imagekit.js");
const foodModel = require("../db/models/foodModel.js");

const uploadImage = async (req, val, id)=>{
    const image= await imageKit.upload(
        {
            file: req.files["image"][0].buffer.toString('base64'), //required
            fileName: req.files["image"][0].originalname, //required,
            folder:`restaurant/${val}/${id}`,
            useUniqueFileName:true
        },
    );
    return image.url
}

const updateChefProfile = async (req, res, next)=>{
    try {
        const {chefId}=req.user; 
        if(req.body.email){
            return sendResponse(res,constans.RESPONSE_BAD_REQUEST,"Not Allow to change Email","",[])
        }
        if(req.body.phone){
            req.body.phone = req.body.phone;
        }
        if(req.body.bio){
            req.body.bio = req.body.bio;
        }
        if(req.body.city){
            req.body.city=req.body.city
        }
        if(req.body.country){
            req.body.country=req.body.country
        }
        if(req.body.state){
            req.body.state=req.body.state
        }
        if(req.body?.chefFoods){
            if(Array.isArray(req.body.chefFoods)){
                req.body.chefFoods= JSON.stringify(req.body.chefFoods)
            }
            req.body.chefFoods=JSON.parse(req.body.chefFoods)
        }
        if(req.files && req.files["image"] && req.files["image"][0]){
            req.body.profileImage = await uploadImage(req, 'chefs', chefId);
        }
        const chef=await chefModel.findOneAndUpdate({chefId:chefId},{$set:req.body},{runValidators: true})
        sendResponse(res,constans.RESPONSE_SUCCESS,"chef updated success",chef.chefId,[])
    } catch (error) {
        if (error.name === 'ValidationError') {
            let errors = [];
            for (field in error.errors) {
                errors.push({ message: error.errors[field].message, key: field });
            }
            sendResponse(res,constans.RESPONSE_BAD_REQUEST,error.message,{},[])
        } else {
            sendResponse(res,constans.RESPONSE_INT_SERVER_ERROR,error.message,"", constans.UNHANDLED_ERROR);
        }
    }
}

const addFood = async (req, res, next)=>{
    try{
        const {title, description, category} = req.body
        const {chefId}=req.user; 
        const foodId = 'Food'+uuidv4();
        let foodPhoto = ''
        if(req.files && req.files["image"] && req.files["image"][0]){
            foodPhoto = await uploadImage(req, 'food', foodId);
        }
        const newFood = await foodModel({
            foodId,
            title,
            description,
            category,
            foodPhoto,
            chefId
        });
        const savedFood = await newFood.save();
        sendResponse(res,constans.RESPONSE_CREATED,"new food added",savedFood.foodId,{});
    }catch(error){
        sendResponse( res,constans.RESPONSE_INT_SERVER_ERROR,error.message,{},constans.UNHANDLED_ERROR);
    }
}

const deleteFood = async (req, res, next)=>{
    try{
        const {chefId}=req.user; 
        const {foodId} = req.params
        const deletedFood = await foodModel.deleteOne({foodId});
        sendResponse(res,constans.RESPONSE_CREATED,"food deleted",deletedFood,{});
    }catch(error){
        sendResponse( res,constans.RESPONSE_INT_SERVER_ERROR,error.message,{},constans.UNHANDLED_ERROR);
    }
}

const updateFood = async (req, res, next)=>{
    try{
        const {foodId} =  req.params;
        req.body.foodPhoto = '';
        if(req.files && req.files["image"] && req.files["image"][0]){
            req.body.foodPhoto = await uploadImage(req, 'food', foodId);
        }
        console.log(req.body);
        const food = await foodModel.findOneAndUpdate(
            {foodId},
            {$set: req.body},
            {runValidators: true}
        );
        sendResponse(res, constans.RESPONSE_SUCCESS, "food updated success", foodId, []);
    }catch(error){
        sendResponse( res,constans.RESPONSE_INT_SERVER_ERROR,error.message,{},constans.UNHANDLED_ERROR);
    }
}

const chefFood = async (req, res, next)=>{
    try{
        const {chefId} = req.user;
        const chefFoods = await foodModel.find({chefId}).select("-__v -_id").populate({
            path: "chef",
            select: "profileImage chefName -_id"
        });
        //console.log(chefFoods);
        if (!chefFoods.length) {
            sendResponse(res, constans.RESPONSE_NOT_FOUND, "No foods Found!", [], [])
        } else {
            sendResponse(res, constans.RESPONSE_SUCCESS, "Done", chefFoods, []);
        }
    }catch(error){
        sendResponse( res,constans.RESPONSE_INT_SERVER_ERROR,error.message,{},constans.UNHANDLED_ERROR);
    }
}

const chefData = async (req, res, next)=>{
    try{
        const {chefId} = req.user;
        const chef = await chefModel.findOne({chefId}).select("-__v -_id -recoveryCode -recoveryCodeDate -encryptedPassword -activateEmail");
        sendResponse(res, constans.RESPONSE_SUCCESS, "Done", chef, []);
    }catch(error){
        sendResponse( res,constans.RESPONSE_INT_SERVER_ERROR,error.message,{},constans.UNHANDLED_ERROR);
    }
}

module.exports = {
    updateChefProfile,
    addFood,
    updateFood,
    chefFood,
    chefData,
    deleteFood
}