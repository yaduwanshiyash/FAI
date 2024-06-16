require('dotenv').config();
var express = require('express');
var router = express.Router();
const app = express();
const userModel = require("./users")
const passport = require("passport")
const upload = require("./multer")
const {route} = require('../app')
const cloudinary = require('../utils/cloudnary');
const nodemailer = require('nodemailer');



const localStrategy = require("passport-local")

passport.use(new localStrategy(userModel.authenticate()))


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});



// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// const GOOGLE_CLIENT_ID = '1092055318698-u44mhaf585363r26ddtb8cbkpsjiv051.apps.googleusercontent.com';
// const GOOGLE_CLIENT_SECRET = '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';
// passport.use(new GoogleStrategy({
//     clientID: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/mytask"
//   },
//   function(accessToken, refreshToken, profile, done) {
//       userProfile=profile;
//       return done(null, userProfile);
//   }
// ));
 
// router.get('/auth/google', 
//   passport.authenticate('google', { scope : ['profile', 'email'] }));
 
//   router.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/error' }),
//   function(req, res) {
//     // Successful authentication, redirect success.
//     res.redirect('/mytask');
//   });


router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/Quation',isLoggedIn, function(req, res, next) {
  res.render('feed');
});
router.get('/Quation-2',isLoggedIn, function(req, res, next) {
  res.render('test2');
});
router.get('/Quation-3',isLoggedIn, function(req, res, next) {
  res.render('test3');
});
router.get('/Quation-4',isLoggedIn, function(req, res, next) {
  res.render('test4');
});
router.get('/Quation-5',isLoggedIn, function(req, res, next) {
  res.render('test5');
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
  try{
    const user = await userModel.findOne({
      username: req.session.passport.user
    })
    res.render('profile', {user});
  } catch(error){
    next(error);
  }
});

router.get('/index', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});


router.post('/register', function(req, res, next) {
  try {
    var userdata = new userModel({
      username: req.body.username,
      email: req.body.email,
      picture: req.body.picture
    });

    userModel.register(userdata, req.body.password)
      .then(function(registereduser) {
        passport.authenticate('local')(req, res, function() {
          res.redirect('/Quation');
        });
      })
      .catch(function(error) {
        if (error.code === 11000) { 
          res.status(400).json({ error: 'Email or username already in use.' });
        } else {
          // Other errors
          next(error);
        }
      });

    sendWelcomeEmail(req.body.email);
  } catch (error) {
    next(error);
  }
});


router.post('/login',passport.authenticate("local",{
  successRedirect: "/Quation",
  failureRedirect: "/index"
}),function(req,res){})



router.post('/dp', isLoggedIn ,upload.single('image'), async function (req, res, next) {
  try{
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log(result);
    let imageupload = await userModel.findOne({username:req.session.passport.user})
    imageupload.picture = result.secure_url,
    await imageupload.save()
    res.redirect('/mytask');
  }catch(error){
    next(error);
  }
});



router.get("/logout",function(req,res,next){
  req.logout(function(err){
    if(err)return next(err);
    res.redirect("/")
  })
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/")
}

function sendWelcomeEmail(userEmail) {
  const mailOptions = {
    from: 'namanjharaa@gmail.com',
    to: userEmail,
    subject: 'Welcome to Your App!',
    text: 'Thank you for registering on our website. We hope you enjoy using our service.'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = router;
