const mongoose = require ("mongoose");
const validator = require ('validator');
const { Schema } = mongoose ;
const foodSchema = new Schema ({
    title: {
        type : String,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    description: {
    type : String,
        trim: true,
        minlength: 3,
        maxlength: 100},
    price :{
        type: Number,
        require : true,
        min:1
    },  foodPhoto: {
        type: Object,
        default: {
            url: "#####",
            publicId:null,
        }
    },
})

const foodModel = mongoose.model('Food', foodSchema);
module.exports = foodModel;