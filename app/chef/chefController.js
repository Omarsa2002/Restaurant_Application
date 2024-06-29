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

const updateChefProfile = async (req, res, next)=>{
    try {
        const {chefId}=req.user; 
        if(req.body.email){
            return sendResponse(res,constans.RESPONSE_BAD_REQUEST,"Not Allow to change Email","",[])
        }
        if(req.body.phone){
            phone = req.body.phone;
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
            const image=await imageKit.upload(
                {
                    file: req.files["image"][0].buffer.toString('base64'), //required
                    fileName: req.files["image"][0].originalname, //required,
                    folder:`restaurant/chefs/${chefId}`,
                    useUniqueFileName:true
                },
            );
            req.body.profileImage=image.url
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

module.exports = {
    updateChefProfile
}