const mongoose = require("mongoose");
'use strict';
const db = {};
const dbConfig = require("./db.config.js");
// mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);
db.mongoose = mongoose;
db.url = dbConfig.url;
const connectiondb=async()=>{
    return  await db.mongoose.connect(db.url, {
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
}


module.exports.connectiondb = connectiondb; 
