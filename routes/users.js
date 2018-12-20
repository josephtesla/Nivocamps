var express = require('express');
var router = express.Router()
var path = require('path')
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
mongoose.connect("mongodb://josephtesla:tesla98@ds123919.mlab.com:23919/nivocamps")
.then((conn) => {
   console.log("connected!")
}).catch(err => {
   console.log(err)
});
const User = require('../models/users');
var exists = false;

router.use(express.static(path.join('public')));

router.get('/register', (req, res) => {
   res.render('register');
})

router.get('/login', (req, res) => {
   res.render('login');
})

//register new user
router.post('/register', (req, res) => {

   var name = req.body.name;
   var username = req.body.username;
   var email = req.body.email;
   var password = req.body.password;
   var password2 = req.body.cpassword;

   
   const checkIfEmpty = (field) => {
     return req.checkBody(field, `${field} is required`).notEmpty();
   }
   
   const checkIfUserExists = (username) => {
      return new Promise((resolve, reject) => {
         User.findOne({username:username}, function(err, user) {
            if (err){
            }
            else {
               if (user) {
                  resolve(true)
               }
               else{
                  reject(false)
               }
            }
         })
      })
   }
   checkIfEmpty('name');
   checkIfEmpty('username');
   checkIfEmpty('email');
   checkIfEmpty('password');
   req.checkBody('cpassword','passwords do not match').equals(password);
   req.checkBody('email','enter a valid email address').isEmail();

   checkIfUserExists(req.body.username)
   .then(resp => {
      var errors = req.validationErrors();
      console.log(errors)
      if (!errors.length){
         var errors = [{param:"",msg:"Username already exists",value:""}]
      }
      else{
         errors.push({param:"",msg:"Username already exists",value:""});
      }
         res.render('register',{
            errors:errors,
            name:name,
            email:email,
            username:username,
            password:password,
            password2:password2
         })
      

   }).catch(resp => {
      var errors = req.validationErrors();
      console.log(errors)
   if (errors){
      res.render('register',{
         user:null,
         errors:errors,
         name:name,
         email:email,
         username:username,
         password:password,
         password2:password2
      })
   }
   else{
      var newUser = {
         name:name,
         email:email,
         username:username,
         password:password,
      }
      
      bcrypt.genSalt(10, (err, salt) => {
         bcrypt.hash(newUser.password, salt, (error, hashedPassword) => {
            newUser.password = hashedPassword;
            if (error) console.log(error.message);
            User.create(newUser, (error, user) => {
               if (error ) {
                  res.send(error)
               }
               else{
                  req.flash('success','Successfully registered, you can now login!');
                  res.location('/users/login')
                  res.redirect('/users/login');
               }
            })
         })
      }) 
   }
})

})

//----User---Login----
passport.serializeUser((user, done) => {
   return done(null, user.id)
})
passport.deserializeUser((id, done) => {
   User.findById(id, (err, user) => {
      return  done(null, user)
   })
})



passport.use(new LocalStrategy(
   (username ,password, done) => {
      User.findOne({username:username}, (err, user) => {
         if(err){
            return done(err);
         }
         if(!user){
            return done(null,false, { message:"invalid username"})
         }
         else{
            bcrypt.compare(password, user.password, (err, isMatch) => {
               if (err){
                  return done(err)
               }
               if (isMatch){
                  return done(null, user)
               }
               else{
                  return done(null, false, {message:"invalid password"})
               }
            })
         }
      })
   }
))

router.post('/login', passport.authenticate('local',{
   successRedirect:'/campgrounds',
   failureRedirect:'/users/login',
   failureFlash:'Invalid username or password'
}))

router.get('/logout', ( req, res) => {
   req.logout();
   req.flash('success', 'You have logged out')
   res.redirect('/users/login');
})


module.exports = router;