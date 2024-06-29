const CONFIG = require("../../config/config");
const username = CONFIG.db_user;
const password = CONFIG.db_password;
const cluster = CONFIG.db_cluster;
const db_name = CONFIG.db_name;

const db_string = CONFIG.db_string

module.exports = {
  //url: `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${db_name}?retryWrites=true&w=majority&appName=Cluster0`
  url: `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${db_name}?retryWrites=true&w=majority`,
};
