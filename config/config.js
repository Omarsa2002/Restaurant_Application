require("dotenv").config(); //instatiate environment variables

let CONFIG = {}; //Make this global to use all over the application

CONFIG.APP_NAME = process.env.APP_NAME || "";

CONFIG.app = process.env.APP || "dev";
CONFIG.port = process.env.PORT || "3000";
CONFIG.BASEURL = process.env.BASEURL || "/api/v1";

CONFIG.db_name = process.env.DB_NAME || "..";
CONFIG.db_user = process.env.DB_USER;
CONFIG.db_password = process.env.DB_PASSWORD;
CONFIG.db_cluster = process.env.DB_CLUSTER;

CONFIG.db_string = process.env.MONGOURl;

CONFIG.PAGINATION_SIZE=5

CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || `${CONFIG.APP_NAME}@ENCRYPTION`;
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || 90000;
CONFIG.authKey=process.env.SECRET_HEADER_KEY

CONFIG.log_file_location = process.env.LOG_FILE_LOCATION;

CONFIG.BCRYPT_SALT = process.env.BCRYPT_SALT || 10;

CONFIG.DUMMY_PASSWORD = `${CONFIG.APP_NAME}$#ord`;

//signup with google Configuration
CONFIG.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
CONFIG.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
CONFIG.CALL_BACK_URL = process.env.CALL_BACK_URL;



//imageKit Configuration
CONFIG.PUBLICKEY=process.env.IMAGE_KIT_PUBLICKEY;
CONFIG.PRIVATEKEY=process.env.IMAGE_KIT_PRIVATEKEY;
CONFIG.URLENDPOINT=process.env.IMAGE_KIT_URLENDPOINT

//Send Grid API Configuration
CONFIG.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
CONFIG.SENDGRID_EMAIL_FROM = process.env.SENDGRID_EMAIL_FROM;

CONFIG.NODEMAILER_EMAIL_FROM = process.env.NODE_MAILER_EMAIL;
CONFIG.NODEMAILER_API_KEY = process.env.NODE_MAILER_PASSWORD;

module.exports = CONFIG;
