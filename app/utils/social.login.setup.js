const passport = require('passport');
const CONFIG = require('../../config/config.js');
const GoogleStrategy = require('passport-google-oauth20').Strategy;



passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
 passport.deserializeUser((user,done)=>{
    done(null,user)
 })

passport.use(new GoogleStrategy({
    clientID:CONFIG.GOOGLE_CLIENT_ID,
    clientSecret:CONFIG.GOOGLE_CLIENT_SECRET,
    callbackURL: CONFIG.CALL_BACK_URL,
    passReqToCallback: true,
  },
  (request,accessToken, refreshToken, profile, done) =>{
    done(null,profile)
  }
));





