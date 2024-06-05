const multer = require("multer")
const { v4: uuidv4 } = require('uuid');
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
      const uniquename = uuidv4()
      cb(null,uniquename+path.extname(file.originalname))
    }
  })

  const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['.png', '.jpg'];
  
    // Check if the file extension is in the allowed list
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedFileTypes.includes(fileExtension)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Invalid file type. Only .png and .jpg files are allowed.'), false); // Reject the file
    }
  };
  
  // Set up Multer limits
  const limits = {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  };
  
  const upload = multer({ storage: storage, fileFilter: fileFilter, limits: limits });
  module.exports = upload;