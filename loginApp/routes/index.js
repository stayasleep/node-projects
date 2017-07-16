const express = require('express');
const router = express.Router();

//this will get the home page
router.get('/',isAuthenticated,(req,res)=>{
    res.render('index');
});

function isAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;