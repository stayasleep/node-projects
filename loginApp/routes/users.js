const express = require('express');
const router =express.Router();

//this will get the home page
router.get('/register',(req,res)=>{
    res.render('register');
});

router.get('/login',(req,res)=>{
    res.render('login');
});

module.exports = router;