const { sendResponse, validateExpiry } = require("../utils/util.service");
const CONFIG = require("../../config/config");
const jwt = require("jsonwebtoken");
const constans = require("../utils/constants");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const jwtGenerator = require("../utils/jwt.generator.js");
const bcrypt = require("bcryptjs");
const userModel = require('../db/models/userModel.js');
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

const updateUserProfile = async (req, res, next)=>{
    try {
        const {userId}=req.user; 
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
        if(req.files && req.files["image"] && req.files["image"][0]){
            req.body.profileImage = await uploadImage(req, 'users', userId);
        }
        const user=await userModel.findOneAndUpdate({userId:userId},{$set:req.body},{runValidators: true})
        sendResponse(res,constans.RESPONSE_SUCCESS,"user updated success",user.userId,[])
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

const addToFavourite = async (req, res, next)=>{
    try{
        const {userId} = req.user;
        const {foodId} = req.body;
        if(foodId){
            const user = await userModel.findOneAndUpdate({userId},{$addToSet:{userFavourite:foodId}},{new:true});
            sendResponse(res,constans.RESPONSE_SUCCESS,"Added to favourite",{},[])
        }else{
            sendResponse(res,constans.RESPONSE_FORBIDDEN,"No food to add to favourite",{},[])
        }
    }catch(error){
        sendResponse( res,constans.RESPONSE_INT_SERVER_ERROR,error.message,{},constans.UNHANDLED_ERROR);
    }
}

const removeFromFavourite = async (req, res, next)=>{
    try{
        const {userId} = req.user;
        const {foodId} = req.body;
        if(foodId){
            const user = await userModel.findOneAndUpdate({userId},{$pull:{userFavourite:foodId}},{new:true});
            sendResponse(res,constans.RESPONSE_SUCCESS,"removed to favourite",{},[])
        }else{
            sendResponse(res,constans.RESPONSE_FORBIDDEN,"No food to remove from favourite",{},[])
        }
    }catch(error){
        sendResponse( res,constans.RESPONSE_INT_SERVER_ERROR,error.message,{},constans.UNHANDLED_ERROR);
    }
}


const userFavourite = async (req, res, next)=>{
    try{
        const {userId} = req.user;
        const user = await userModel.findOne({userId}).select('userFavourite -_id')
        if(user){
            let userFavouriteArray = [];
            const {userFavourite} = user;
            for(const foodId of userFavourite){
                const fav =  await foodModel.findOne({foodId}).select('-_id -__v -id').populate({
                    path: "chef",
                    select: "profileImage chefName -_id"
                });
                userFavouriteArray.push(fav);
            }
            sendResponse(res,constans.RESPONSE_SUCCESS,"done",userFavouriteArray,[])
        }else{
            sendResponse(res,constans.RESPONSE_NOT_FOUND,"No Favourite for you ",{},[])
        }
    }catch(error){
        sendResponse( res,constans.RESPONSE_INT_SERVER_ERROR,error.message,{},constans.UNHANDLED_ERROR);
    }
}




const userData = async (req, res, next)=>{
    try{
        const {userId} = req.user;
        const user = await userModel.findOne({userId}).select("-__v -_id -recoveryCode -recoveryCodeDate -encryptedPassword -activateEmail");
        sendResponse(res, constans.RESPONSE_SUCCESS, "Done", user, []);
    }catch(error){
        sendResponse( res,constans.RESPONSE_INT_SERVER_ERROR,error.message,{},constans.UNHANDLED_ERROR);
    }
}

module.exports = {
    updateUserProfile,
    userData,
    addToFavourite,
    removeFromFavourite,
    userFavourite
}