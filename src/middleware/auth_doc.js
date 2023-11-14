const multer = require("multer");
const path = require("path");


const uploadPDF = (pdf) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/pdf");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "_" + file.originalname.replace(/\s/g, ""));
    },
  });

  const fileFilter = function (req, file, cb) {
    const allowedFileTypes = /pdf/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(null, false); //file tidak masuk ke sql dan folder, error message langsung diteruskan ke controller catch error
     
    }
  };
  const uploadDoc = multer({
    storage,
    fileFilter,
  }).single(pdf);

  return uploadDoc;
};



module.exports = {
  uploadPDF
};
