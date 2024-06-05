require('dotenv').config();
var mongoose = require('mongoose')
var plm = require('passport-local-mongoose')

const mongoURL = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017/Form-site';

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected!'))
  .catch(err => console.error('Connection error', err));

const userSchema = mongoose.Schema({
   username: {
    type: String,
    required: true,
    unique: true,
   },
   password: {
    type: String,
   },
   picture: {
    type: String,
   },
   email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
   },

   


})

userSchema.plugin(plm);

module.exports = mongoose.model("user",userSchema)