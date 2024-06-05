require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: process.env.set_cloud_name, 
  api_key: process.env.set_api_key, 
  api_secret: process.env.set_api_secret 
});

module.exports = cloudinary;
