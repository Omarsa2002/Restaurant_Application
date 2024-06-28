const jwt = require("jsonwebtoken");
const CONFIG = require("../../config/config.js");
const jwtGenerator = require("../utils/jwt.generator.js");
const { SEND_EMAIL_BY_NODEMAILER } = require("../utils/email.configuration.js");
const userModel = require ('../db/models/userModel.js');
const chefModel = require ('../db/models/chefModel.js');
const { domains } = require("googleapis/build/src/apis/domains/index.js");


//............check from atcivate email.........//
const sendEmail = async function (user, messagHeader, code = "") {
  const message = `${code ? `RecoveryCode: ${code}` : ""}`;
  const info = SEND_EMAIL_BY_NODEMAILER(user.email, messagHeader, message);
  return info;
};

const sendConfirmEmail = async function (req, user, routeLink, messageLink, messagHeader, code = "") {
  let tokenconfirm
  if(user.userId){
    tokenconfirm = await jwtGenerator({ userId: user.userId, TO: "user" }, 1, "h");
  }
  else if(user.chefId){
    tokenconfirm = await jwtGenerator({ chefId: user.chefId, TO: "chef" }, 1, "h");
  }
  const link = `${req.protocol}://${req.headers.host}/api/v1/${routeLink}/${tokenconfirm}`;
  const message = `<a href='${link}'>follow me to ${messageLink}</a> <br></br> ${code ? `RecoveryCode: ${code}` : ""}<br></br>`;
  const info = SEND_EMAIL_BY_NODEMAILER(user.email, messagHeader, message);
  return info;
};

const checktype=(type)=>{
  if(type=="user"){
    return  userModel
  }
  if(type=="chef"){
    return chefModel
  }
}

//--------------------//

module.exports = {
  sendEmail,
  sendConfirmEmail,
  checktype
};
