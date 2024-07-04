const   mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
const CONFIG = require('../../../config/config.js');

const chefSchema = new mongoose.Schema(
    {
        chefId: String,
        email: {
            type:String,
            required:true
        },
        encryptedPassword: {
            type:String,
        },
        chefName:String,
        gender:{
            type: String,
            enum: ['male', 'female'],
        },
        phone: String,
        profileImage: String,
        bio:String,
        city: String,
        state: String,
        country: String,
        activateEmail: {
            type: Boolean,
            default: false,
        },
        recoveryCode: String,
        recoveryCodeDate: Date,
        accountType:{
            type:String,
            default:"system",
            enum:["system", "google"]
        },
        isDeleted:{
            type:Boolean,
            default:false
        },
        platform:{
            type:String, 
            enum:["mobileApp"]
        },
        chefFoods: [String],
    },
    {
        timestamps: true
    }
);


chefSchema.virtual("password").set(function(password){
    this.encryptedPassword=bcrypt.hashSync(password,parseInt(CONFIG.BCRYPT_SALT))
})
.get(function(){
    return this.encryptedPassword
})


const chefModel = mongoose.model('Chef', chefSchema);

module.exports = chefModel;
