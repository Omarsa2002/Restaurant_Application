const multer = require("multer");
const { sendResponse } = require('./util.service');
const conestans = require('./constants');

const diskStorage = multer.diskStorage({
    destination: function (req, file,  cb) {
        console.log(file);
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${req.body.firstName}-${Date.now()}.${ext}`;
        console.log(fileName);
        cb(null, fileName);
    }
});
const fileFilter = function (req, file, cb) {
    const type = file.mimetype.split('/')[0];
    return (type === 'image')? cb(null, true):cb(sendResponse(res,conestans.RESPONSE_BAD_REQUEST,'This is not an image'), false);
}

const upload  = multer({
    storage: diskStorage,
    fileFilter
});

module.exports =  {
    diskStorage,
    fileFilter,
    upload
}