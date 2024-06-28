// const { ExtractJwt, Strategy } = require('passport-jwt');
const {to}          = require('./util.service');
const LOG = require('../../config/logger');
const CookieStrategy = require("passport-cookie").Strategy;
const jwt = require("jsonwebtoken");
const tokenSchema = require('../auth/token.schema.js');
const userModel = require('../DB/models/user.Schema.js');
const CONFIG = require('../../config/config.js');
const companyModel = require('../DB/models/company.Schema.js');





module.exports = function (passport) {
    passport.use(
      new CookieStrategy(function (token, done) {
        const decoded = jwt.verify(token, CONFIG.jwt_encryption);
        if(decoded.companyId){
          tokenSchema.findOne({ companyId: decoded.companyId, token: token });
          companyModel.findOne({ companyId: decoded.companyId }, function (err, user) {
            if (err) {
              return done(err);
            }
            if (!user) {
              return done(null, false);
            }
            else{
              LOG.info("logged company :"+decoded.companyId)
              return done(null, user);
            }
          });
        }
        else{
          tokenSchema.findOne({ userId: decoded.userId, token: token });
          userModel.findOne({ userId: decoded.userId }, function (err, user) {
            if (err) {
              return done(err);
            }
            if (!user) {
              return done(null, false);
            }
            else{
              LOG.info("logged user :"+decoded.userId)
              return done(null, user);
            }
          });
        }
      })
    );

  };

// module.exports = function (passport) {
//     passport.use(
//       new appAuthStrategy(function (token, done) {
//         const decoded = jwt.verify(token, CONFIG.jwt_encryption);
//         if(decoded.companyId){
//           tokenSchema.findOne({ companyId: decoded.companyId, token: token });
//           companyModel.findOne({ companyId: decoded.companyId }, function (err, user) {
//             if (err) {
//               return done(err);
//             }
//             if (!user) {
//               return done(null, false);
//             }
//             else{
//               LOG.info("logged company :"+decoded.companyId)
//               return done(null, user);
//             }
//           });
//         }
//         else{
//           tokenSchema.findOne({ userId: decoded.userId, token: token });
//           userModel.findOne({ userId: decoded.userId }, function (err, user) {
//             if (err) {
//               return done(err);
//             }
//             if (!user) {
//               return done(null, false);
//             }
//             else{
//               LOG.info("logged user :"+decoded.userId)
//               return done(null, user);
//             }
//           });
//         }
//       })
//     );

//   };

  // module.exports = function(passport) {
//     var opts = {};
//     opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
//     opts.secretOrKey = CONFIG.jwt_encryption;
//     passport.use("appAuth",new Strategy(opts, async function(jwt_payload, done){
//         let err, user;
//         [err, user] = await to(User.findOne({_id: jwt_payload.user_id}));
//         //validTokenSchema.findOne({userId: jwt_payload.user_id, token: fromAuthHeaderAsBearerToken()});
//         if(err) return done(err, false);
//         if(user) {
//             LOG.info("logged user :" + user.loginId);
//             return done(null, user);
//         } else {
//             return done(null, false);
//         }
//     }));
// }













  // module.exports = function(passport) {
//     var opts = {};
//     opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
//     opts.secretOrKey = CONFIG.jwt_encryption;
//     passport.use("appAuth",new Strategy(opts, async function(jwt_payload, done){
//         let err, user;
//         [err, user] = await to(User.findOne({_id: jwt_payload.user_id}));
//         //validTokenSchema.findOne({userId: jwt_payload.user_id, token: fromAuthHeaderAsBearerToken()});
//         if(err) return done(err, false);
//         if(user) {
//             LOG.info("logged user :" + user.loginId);
//             return done(null, user);
//         } else {
//             return done(null, false);
//         }
//     }));
// }