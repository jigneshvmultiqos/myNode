const multer = require('multer');
const path = require("path")


//middleware for adding image
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,"../../public/uploads/user"))
    },
    filename: function (req, file, cb) {
        cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});
// module.exports = storage
//console.log(storage);
module.exports.upload = multer({storage:storage})




module.exports.uploadImage = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
            return cb(new Error("Please upload an image!"), false);
        }
        cb(undefined, true);
    },
});

module.exports.validMulterUploadMiddleware = (multerUploadFunction) => {
    return (req, res, next) =>
        multerUploadFunction(req, res, (err) => {
            // handle Multer error
            if (err && err.name && err.name === "MulterError") {
                return res.status(400).json({ error: 'MulterError.' });
                //return responseHelper.error(res, res.__("SomethingWentWrongPleaseTryAgain"), SERVERERROR);
            }

            if (err) {
                // handle other errors
                //return responseHelper.error(res, res.__("UploadValidImage"), FAILURE);
                return res.status(400).json({ error: 'MulterError err.' });
            }
            next();
        });
};