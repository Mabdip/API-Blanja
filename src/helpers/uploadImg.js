const multer = require("multer");
const path = require("path");
const form = require("./form");

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images");
    },
    filename: function (req, file, cb) {
        const nameFormat = `img-${Date.now()}${path.extname(
            file.originalname
        )}`;
        cb(null, nameFormat);
    },
});

const upload = multer({
    storage: multerStorage,
    limits: { fileSize: 10 * 1024 * 1024 } // 2 MB
});

const multiUpload = (req, res, next) => {
    const uploadMultiple = upload.array("product_img", 5);
    uploadMultiple(req, res, (err) => {
        if (err) {
            form.error(res, {
                msg: "Multer Error",
                err,
            });
        } else {
            let filePath = req.files.map((val) => "/images/" + val.filename)

            req.filePath = filePath.join(',')
            next();
        }
    });
};



module.exports = multiUpload;