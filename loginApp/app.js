// const express = require('express');
// const app = express();
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// const exphbs = require('express-handlebars');
// const expressValidator = require('express-validator');
// const flash = require('connect-flash');
// const session = require('express-session');
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const mongo = require('mongodb');
// const mongoose = require('mongoose');
// //connect to the mongoose db once its up
// //this took me too long, make it in a diff route enxt time
// // mongoose.connect('mongodb://localhost/loginApp');
// // const db = mongoose.connection;

// //Set up routes
// const routes = require('./routes/index');
// const users = require('./routes/users');

// //View Engine
// app.set('views',path.join(__dirname,'views'));
// app.engine('handlebars',exphbs({defaultLayout:'layout'})); //default will be called layout.handlebars
// app.set('view engine', 'handlebars');

// //bodyparser middleware -takes raw requests and turns them into usable properties
// //on the req object
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
// //allows us to create cookies to send to client
// app.use(cookieParser());

// //Static Folder
// app.use(express.static(path.join(__dirname,'public')));

// //Express Session
// app.use(session({
//     secret:'secret', //this will be moved later when I finish up the basics
//     saveUninitialized: true,
//     resave: true
// }));
// //passport init
// app.use(passport.initialize());
// app.use(passport.session());

// //Express Validator
// app.use(expressValidator({
//     errorFormatter: function(param,msg,value){
//         let namespace = param.split('.')
//         , root = namespace.shift()
//         , formParam = root;

//         while(namespace.length){
//             formParam+='['+namespace.shift()+']';
//         }
//         return{
//             param: formParam,
//             msg: msg,
//             value: value
//         };
//     }
// }));

// //connect flash mw
// app.use(flash());

// //Globals for Flash
// app.use(function(req,res,next){
//     res.locals.succes_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
//     res.locals.error = req.flash('error');
// });

// //Set up all routes and user route
// app.use('/',routes);
// app.use('/users',users);

// // app.set('port',(process.env.PORT || 1337));
// // app.listen(app.get('port'),function(){
// //     console.log('Server on port'+app.get('port'));
// // });

// app.listen(1337,function(){
//     console.log('sweet leet radio');
// });
const express = require('express');
const path = require('path');
const cookieParser=require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs=require('express-handlebars');
const expressValidator=require('express-validator');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;

//initialize app
const app = express();
//db require

const routes = require('./routes/index');
const users = require('./routes/users');

//view engine
//we want folder called views to handle our views
app.set('views',path.join(__dirname,'views'));
//handlebars as app.engine
//default layout file we want ot be called layout, layouthandlebars
app.engine('handlebars',exphbs({defaultLayout:'layout'}));
//app.set view engine to handlebars
app.set('view engine', 'handlebars');

//bodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

//set pub folder, but css imgs jq
app.use(express.static(path.join(__dirname,'public')));

//MW for EXP SESSION
app.use(session({
    secret:'secret', //set 'secret' to whatever you want
    saveUninitialized: true,
    resave: true
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

//Exp Validator, taken from github page
app.use(expressValidator({
    errorFormatter: function (param,msg,value) {
        var namespace=param.split('.')
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

//connect flash mw
app.use(flash());

//globals
app.use(function(request,response,next){
    response.locals.success_msg = request.flash('success_msg');
    response.locals.error_msg=request.flash('error_msg');
    //flash has its own msg n it sets it to error
    response.locals.error=request.flash('error');
    next();
});

app.use('/',routes); //mapped to routes n goes to index
app.use('/users',users);

//set port
// app.set('port',(process.env.PORT || 1337));
// app.listen(app.get('port'),function(){
//     console.log('server listening on '+app.get('port'));
// });

app.listen(1337,function(){
    console.log('listening on');
});
