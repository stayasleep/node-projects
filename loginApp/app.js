const express = require('express');
const app = express();
const path = require('path');
const cookieParser=require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs=require('express-handlebars');
const expressValidator=require('express-validator');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');
// //connect to the mongoose db once its up
// //this took me too long, make it in a diff route enxt time

// //Set up routes
const routes = require('./routes/index');
const users = require('./routes/users');

// //View Engine
//we want folder called views to handle our views
app.set('views',path.join(__dirname,'views'));
//default layout file we want ot be called layout, layout.handlebars
app.engine('handlebars',exphbs({defaultLayout:'layout'}));
//app.set view engine to handlebars
app.set('view engine', 'handlebars');


// //bodyparser middleware -takes raw requests and turns them into usable properties
// //on the req object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// //allows us to create cookies to send to client
app.use(cookieParser());

// //Static Folder
app.use(express.static(path.join(__dirname,'public')));

// //Express Session
app.use(session({
    secret:'secret', //this will be moved later when I finish up the basics
    saveUninitialized: true,
    resave: true
}));

// //passport init
app.use(passport.initialize());
app.use(passport.session());

//Exp Validator, taken from github page
app.use(expressValidator({
    errorFormatter: function (param,msg,value) {
        let namespace=param.split('.')
            ,root = namespace.shift()
            ,formParam = root;
        while(namespace.length){
            formParam += '['+namespace.shift()+']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));
// //connect flash mw
app.use(flash());

// //Globals for Flash
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// //map the routes and user route
app.use('/',routes);
app.use('/users',users);

app.set('port',(process.env.PORT || 1337));
app.listen(app.get('port'),function(){
    console.log('Server on port'+app.get('port'));
});

// app.listen(1337,function(){
//     console.log('listening on');
// });