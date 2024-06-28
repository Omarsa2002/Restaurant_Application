const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  userId: {
    type: String,
    required: false,
  },
  chefId: {
    type: String,
    required: false,
  },
  token: {
    type: String,
    required: false,
  },
});

TokenSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  //object.userID = _id;
  return object;
});

module.exports = mongoose.model("Token", TokenSchema);
