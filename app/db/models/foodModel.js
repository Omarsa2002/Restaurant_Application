const mongoose = require ("mongoose");
const validator = require ('validator');
const { Schema } = mongoose ;
const foodSchema = new Schema ({
    foodId:String,
    title: {
        type : String,
        trim: true,
    },
    description: {
    type : String,
        trim: true,
    },
    category:{
        type: String,
        enum:['breakfast', 'lunch', 'diner']
    },
    foodPhoto: {
        type: String
    },
    chefId:{
        type:String,
    }
},
{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
}
)

foodSchema.virtual("chef",{
    ref: "Chef",
    localField: "chefId",
    foreignField:"chefId"
})

const foodModel = mongoose.model('Food', foodSchema);
module.exports = foodModel;