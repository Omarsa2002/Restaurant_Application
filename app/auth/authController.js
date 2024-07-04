const userModel = require ('../db/models/userModel.js');
const { sendResponse, validateExpiry } = require("../utils/util.service");
const CONFIG = require("../../config/config");
const jwt = require("jsonwebtoken");
const constans = require("../utils/constants");
const path = require("path");
const helper = require("./helper.js");
const { v4: uuidv4 } = require("uuid");
const jwtGenerator = require("../utils/jwt.generator.js");
const tokenSchema = require("./token.schema.js");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CONFIG.GOOGLE_CLIENT_ID);
const chefModel = require('../db/models/chefModel.js');

//-------------------------------------user-------------------------------------//
const signUp = async(req, res, next) => {
    try {
        const { email, userName, password, gender } = req.body;
        const user = await userModel.findOne({ email: email });
        if (!user) {
            const newUser = await userModel({
                email,
                userId: "User" + uuidv4(),
                userName,
                password,
                gender
            });
            // const savedUser = await newUser.save();
            // sendResponse(res,constans.RESPONSE_CREATED,"Done",savedUser.userId,{});
            const confirmLink = "confirm your account";
            const confirmMessag ="Confirmation Email Send From restaurant Application";
            const info = await helper.sendConfirmEmail(req,newUser,"auth/confirmemail",confirmLink,confirmMessag);
            if (info) {
                const savedUser = await newUser.save(); 
                sendResponse(res,constans.RESPONSE_CREATED,"Done",savedUser.userId,{});
            } else {
                sendResponse(res,constans.RESPONSE_BAD_REQUEST,"rejected Eamil", [], []);
            }
        }else if(user && user.isDeleted){
            await userModel.updateOne({email}, {$set:{isDeleted: false}});
            sendResponse(res,constans.RESPONSE_CREATED,"Done",user.userId,{});
        }else{
            sendResponse(res,constans.RESPONSE_BAD_REQUEST,"email already exist", "" , []);
        }
    } catch (error) {
        sendResponse( res,constans.RESPONSE_INT_SERVER_ERROR,error.message,{},constans.UNHANDLED_ERROR);
    }
};


const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        //..Check if User Exists..//
        if (!user|| user.isDeleted) {
            return sendResponse(res,constans.RESPONSE_BAD_REQUEST,"Email not found!",{},[]);
        }
        //..Compare Passwords..//
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return sendResponse(res, constans.RESPONSE_BAD_REQUEST, "Wrong password!", {}, []);
        }
        //..Check if Email is Activated..//
        if (!user.activateEmail) {
            const confirmLink = "confirm your account";
            const confirmMessag = "Confirmation Email Send From restaurant Application";
            const result = await helper.sendConfirmEmail(req,user,"auth/confirmemail",confirmLink,confirmMessag);
            if (result) {
                return sendResponse(res,constans.RESPONSE_BAD_REQUEST,"Confirm your email ... we've sent a message at your email",{},[]);
            }
        }
        //..Generate Access Token..//
        const accToken = await jwtGenerator({ userId: user.userId,role:"user" }, 24, "h");
        existingToken = await tokenSchema.findOne({ userId: user.userId });
        if (existingToken) {
            await tokenSchema.updateOne(
                { userId: user.userId },
                { $set: {token: accToken } }
            );
        } else {
            newToken = new tokenSchema({
                userId: user.userId,
                token: accToken,
            });
            await newToken.save();
        }
        // setTokenWithCookies(res, accToken);
        const data = {
            userId: user.userId,
            token: accToken,
            userName:user.userName,
            profileImage:user?.profileImage,
        }
        return sendResponse(res, constans.RESPONSE_SUCCESS, "Login Succeed", data, []);
    } catch (error) {
        sendResponse( res,constans.RESPONSE_INT_SERVER_ERROR,error.message,{},constans.UNHANDLED_ERROR);
    }
};
 
//-------------------------------------chef-------------------------------------//
const chefSignUp = async (req, res, next) => {
    try {
        const { email, name, phone, password, city, country, state, foods, gender } = req.body;
        const chef = await chefModel.findOne({ email: email });
        if (!chef) {
            const newChef = await chefModel({
                email,
                chefName: name,
                chefId: "Chef" + uuidv4(),
                password,
                city,
                country,
                state,
                phone,
                chefFoods: foods,
                gender
            });
            const confirmLink = "confirm your account";
            const confirmMessag = "Confirmation Email Send From restaurant Application";
            const info = await helper.sendConfirmEmail(req, newChef, "auth/confirmemail", confirmLink, confirmMessag);
            if (info) {
                const savedChef = await newChef.save();
                sendResponse(res,constans.RESPONSE_CREATED,"Done",savedChef.chefId,[]);
            } else {
                sendResponse(res,constans.RESPONSE_BAD_REQUEST,"rejected Eamil","",[]);
            }
        }else{
            sendResponse(res,constans.RESPONSE_BAD_REQUEST,"email already exist","",[]);
        }
    } catch (error) {
        sendResponse(res,constans.RESPONSE_BAD_REQUEST,error.message,"",constans.UNHANDLED_ERROR);
    }
};

const chefLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const chef = await chefModel.findOne({ email });
        //..Check if chef Exists..//
        if (!chef) {
            return sendResponse(res,constans.RESPONSE_BAD_REQUEST,"Email not found!",{},[]);
        }
        //..Compare Passwords..//
        const isPasswordCorrect = await bcrypt.compare(password, chef.password);
        if (!isPasswordCorrect) {
            return sendResponse(res, constans.RESPONSE_BAD_REQUEST, "Wrong password!", {}, []);
        }
        //..Check if Email is Activated..//
        if (!chef.activateEmail) {
            const confirmLink = "confirm u account";
            const confirmMessag = "Confirmation Email Send From Intern-Hub Application";
            const result = await helper.sendConfirmEmail(req,chef,"auth/confirmemail",confirmLink,confirmMessag);
            if (result) {
                return sendResponse(res,constans.RESPONSE_BAD_REQUEST,"Confirm your email ... we've sent a message at your email",{},[]);
            }
        }
        //..Generate Access Token..//
        const accToken = await jwtGenerator({ chefId: chef.chefId,role:"chef" }, 24, "h");
        existingToken = await tokenSchema.findOne({ chefId: chef.chefId });
        if (existingToken) {
            await tokenSchema.updateOne(
                { chefId: chef.chefId },
                { $set: {token: accToken } }
            );
        } else {
            newToken = new tokenSchema({
                chefId: chef.chefId,
                token: accToken,
            });
            await newToken.save();
        }
        // Set the access token as an HTTP-only cookie
        // setTokenWithCookies(res, accToken);
        const data = {
            chefId: chef.chefId,
            token: accToken,
            name:chef.chefName,
            image:chef.profileImage
        }
        sendResponse(res, constans.RESPONSE_SUCCESS, "Login Succeed", data, []);
    } catch (error) {
        sendResponse( res,constans.RESPONSE_INT_SERVER_ERROR,error.message,{},constans.UNHANDLED_ERROR);
    }
};

//-------------------------------------general-------------------------------------//
const verifyEmail = async(req, res, next) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, CONFIG.jwt_encryption);
        if (!decoded?.userId && !decoded?.chefId) {
            sendResponse(res,constans.RESPONSE_UNAUTHORIZED,"invaildToken",{},[]);
        } else {
            let user = '';
            let chef = '';
            const type=decoded.TO;
                if(decoded.TO === "user"){
                    user = await userModel.findOneAndUpdate(
                        { userId: decoded.userId, activateEmail: false },
                        { activateEmail: true }
                    );
                }
                else if(decoded.TO === "chef"){
                    chef = await chefModel.findOneAndUpdate(
                        { chefId: decoded.chefId, activateEmail: false },
                        { activateEmail: true }
                    );
                }
            if (!user && !chef) {
                sendResponse(res,constans.RESPONSE_BAD_REQUEST,"email already confirmed or in-vaild token",type,[]);
            } else {
                sendResponse(res,constans.RESPONSE_SUCCESS,"Confirmed Succeed",type,[]);
            }
        }
    } catch (error) {
        sendResponse( res,constans.RESPONSE_INT_SERVER_ERROR,error.message,{},constans.UNHANDLED_ERROR);
    }
};

const reSendcode = async (req, res, next) => {
    try {
        const { email, type } = req.body;
        let userOrChef;
        const model=helper.checktype(type)
        if(!model){
            return sendResponse(res,constans.RESPONSE_BAD_REQUEST,"Invalid account type",{},[])
        }
        userOrChef = await model.findOne({ email: email });
        if (!userOrChef|| userOrChef.isDeleted) {
            sendResponse(res, constans.RESPONSE_BAD_REQUEST, "This email does not exist", {}, []);
        } else {
            const code = Math.floor(10000 + Math.random() * 90000);
            const info = helper.sendEmail( userOrChef, "recovery code", code);
            if (info) {
                await model.updateOne(
                    { email },
                    { $set: { recoveryCode: code, recoveryCodeDate: Date.now() } }
                );
                sendResponse(res, constans.RESPONSE_SUCCESS, `Recovery code resent to ${email}`, {}, [] );
            }
        }
    } catch (error) {
        sendResponse( res,constans.RESPONSE_INT_SERVER_ERROR,error.message,{},constans.UNHANDLED_ERROR);
    }
};

const forgetPassword = async (req, res, next) => {
    try {
        const {email,type} = req.body;
        let userOrChef;
        const model=helper.checktype(type)
        if(!model){
            return sendResponse(res,constans.RESPONSE_BAD_REQUEST,"Invalid account type",{},[])
        }
        userOrChef = await model.findOne({ email: email });
        if (!userOrChef || userOrChef.isDeleted) {
            sendResponse(res, constans.RESPONSE_BAD_REQUEST, "This email does not exist", {}, []);
        } else {
            // if(userOrcompamy.accountType!="system"){
            //     return sendResponse(res,constans.RESPONSE_BAD_REQUEST,"google auth",{},[])
            // }
            const code = Math.floor(10000 + Math.random() * 90000);
            const setPasswordMessag = "an update password email was sent from restaurant Application";
            const info = helper.sendEmail(userOrChef, setPasswordMessag, code); 
            if (info) {
                await model.updateOne(
                    { email },
                    { $set: { recoveryCode: code, recoveryCodeDate: Date.now() } }
                );
                sendResponse(res, constans.RESPONSE_SUCCESS, `we sent you an email at ${email}`, {}, []);
            }
        }
    } catch (error) {
        sendResponse( res,constans.RESPONSE_INT_SERVER_ERROR,error.message,{},constans.UNHANDLED_ERROR);
    }
};


const setPassword = async (req, res, next) => {
    try {
        const { password, code, email, type } = req.body;
        let model=helper.checktype(type)
        if(!model){
            return sendResponse(res,constans.RESPONSE_BAD_REQUEST,"Invalid account type",{},[])
        }
        let userOrChefId = (model === userModel) ? "userId" : "chefId";
        const  userOrChef = await model.findOne({ email });
        if (userOrChef.recoveryCode === code && validateExpiry(userOrChef.recoveryCodeDate) && code) {
            const encryptedPassword = bcrypt.hashSync(password, parseInt(CONFIG.BCRYPT_SALT));
            await model.updateOne(
                { [userOrChefId]: userOrChef[userOrChefId] },
                { $set: { recoveryCode: "",encryptedPassword } }
            );
            sendResponse(res, constans.RESPONSE_SUCCESS, "Set new password successful", {}, []);
        } else {
            sendResponse( res, constans.RESPONSE_BAD_REQUEST, "Invalid or expired code", "", []);
        }
    } catch (error) {
        sendResponse( res,constans.RESPONSE_INT_SERVER_ERROR,error.message,{},constans.UNHANDLED_ERROR);;
    }
};

const checkToken = async (req, res, next) => {
    function extractToken() {
        const token = req.headers['Authorization'] ?? req.headers['authorization'];
        if (token) {
            return token.split("restaurant_")[1];
        }
    }
    const token = extractToken();
    if (!token) {
        return sendResponse(res, constans.RESPONSE_BAD_REQUEST, "Token is required", false, []);
    }
    try {
        jwt.verify(token, CONFIG.jwt_encryption);
    } catch (error) {
        return sendResponse(res, constans.RESPONSE_SUCCESS, "Token is invalid", false, []);
    }
    if (!await tokenSchema.findOne({ token })) {
        return sendResponse(res, constans.RESPONSE_BAD_REQUEST, "Token does not exist or Removed", false, []);
    }
    sendResponse(res, constans.RESPONSE_SUCCESS, "Done", true, []);
}

//..................logout............................//
const signOut=async(req,res,next)=>{ 
    try {
        if(req.headers["Authorization"]||req.headers["authorization"]){
            const token =req.headers["Authorization"] || req.headers["authorization"].split("restaurant_")[1];
            const deletetoken=await tokenSchema.findOneAndDelete({token:token})
            if(deletetoken){
                delete req.headers['Authorization']||req.headers['authorization']
                sendResponse(res,constans.RESPONSE_SUCCESS, "Sign-Out successfully", '', []);
            }
            else{
                sendResponse(res,constans.RESPONSE_UNAUTHORIZED, "Unauthorized", '', []);
            }
        }
        else{
            await tokenSchema.findOneAndDelete({token:req.cookies.token})
            res.clearCookie("token");   
            sendResponse(res,constans.RESPONSE_SUCCESS, "Sign-Out successfully", '', []);
        }
    } catch (error) {
        sendResponse(res,constans.RESPONSE_INT_SERVER_ERROR,error.message,"", constans.UNHANDLED_ERROR);
    }
}


module.exports = {
    signUp,
    verifyEmail,
    login,
    chefSignUp,
    chefLogin,
    reSendcode,
    forgetPassword,
    setPassword,
    checkToken,
    signOut
}