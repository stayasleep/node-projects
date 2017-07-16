const express = require('express');
const router =express.Router();
const User = require('../models/user');
//Register Route
router.get('/register',(req,res)=>{
    res.render('register');
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

//Login Route
router.get('/login',(req,res)=>{
    res.render('login');
});

module.exports = router;