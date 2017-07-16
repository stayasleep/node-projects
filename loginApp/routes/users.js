const express = require('express');
const router =express.Router();
const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Register Route
router.get('/register',(req,res)=>{
    res.render('register');
});
router.get('/login',function(req,res){
    res.render('login');
});

//Register user
router.post('/register',(req,res)=>{
    let name = req.body.name;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let passCheck = req.body.password2;

    //validation to check if fields are filled in
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    //checks to see if valid email address
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('username','Username is required').notEmpty();
    req.checkBody('password','Password is required').notEmpty();
    //pass first pw to check if equal
    req.checkBody('password2','Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();
    if(errors){
        res.render('register',{
            errors: errors
        });
        console.log('yes error');
    }else{
        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        User.createUser(newUser,function(err,user){
            if (err) throw err;
            console.log('user',user);
        });

        req.flash('success_msg','You are registed and can now login');
        res.redirect('/users/login');
    }
});

//from passport github...does 2 things
//gets the username [matches what you put in] and then validates pw
passport.use(new LocalStrategy(
  function(username, password, done) {
      User.getUserByUsername(username,(err,user)=>{
          if (err) throw err;
          //if not a match
          if(!user){
              return done(null,false,{message:"Unknown User"});
          }
          User.comparePassword(password,user.password,(err,isMatch)=>{
              if(err) throw err;
              if(isMatch){
                  return done(null,user);
                
              }else{
                  return done(null,false,{message:"Invalid password"});
              }
          });
      });
  }));

passport.serializeUser(function(user,done){
    done(null,user.id);
});

passport.deserializeUser(function(id,done){
    User.getUserById(id,function(err,user){
        done(err,user);
    });
});


//Login Route w. local strategy for our local db
router.post('/login',passport.authenticate('local',{successRedirect:'/',failureRedirect:"/users/login", failureFlash: true}),
(req,res)=>{
    res.redirect('/');

});
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You have logged out');

    res.redirect('/users/login');
});
module.exports = router;