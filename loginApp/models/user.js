const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/loginApp');

const db = mongoose.connection;

//User Schema to create user obj
const UserSchema = mongoose.Schema({
    username:{
        type:String,
        index:true
    },
    password:{
        type:String
    },
    email:{
        type: String
    },
    name:{
        type: String
    }
});

//func to use anywhere and make users: model name 'User' and userschema var
const User = module.exports = mongoose.model('User',UserSchema);

module.exports.createUser = function(newUser,callback){
    // Use bcrypt to salt and hash the password.
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash; //pass the hashed password to mongo
            newUser.save(callback); 
            
        });
    });
}