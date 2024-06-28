const ImageKit = require("imagekit");
const CONFIG = require("../../config/config.js");


let imageKit = new ImageKit({
    publicKey: CONFIG.PUBLICKEY,
    privateKey:CONFIG.PRIVATEKEY,
    urlEndpoint: CONFIG.URLENDPOINT,
  });

module.exports.imageKit=imageKit