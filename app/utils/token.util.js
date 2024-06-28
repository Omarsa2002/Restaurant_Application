const Validtoken = require("../auth/valid.token.schema");
const User = require("../user/user.schema");
const Company = require("../DB/models/company.Schema");
const { to, ReE, formatError } = require("../utils/util.service");

const validateToken = async function (req, res, next) {
  let err, validtoken;
  [err, validtoken] = await to(
    Validtoken.findOne({ token: req.get("Authorization") })
  );
  if (err || !validtoken) {
    return ReE(res, "Invalid token.", 401);
  }
  req.token = validtoken;
  next();
};
module.exports.validateToken = validateToken;

let user = async function (req, res, next) {
  let user_id, err, user;
  user_id = req.params.user_id;
  [err, user] = await to(User.findOne({ _id: user_id }));
  if (err) return ReE(res, err.message);
  if (!user) return ReE(res, formatError("User not found.", "user"), 404);
  req.user = user;
  next();
};
module.exports.user = user;

let company = async function (req, res, next) {
  let company_id, err, company;
  company_id = req.params.company_id;
  [err, company] = await to(Company.findOne({ _id: company_id }));
  if (err) return ReE(res, err.message);
  if (!company)
    return ReE(res, formatError("company was not found.", "company"), 404);
  req.company = company;
  next();
};
module.exports.company = company;
