const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    dateEntered: {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        required: true
    }
});
UserSchema.statics.hashPassword = function(password, callback){
    bcrypt.hash(password, 10, (err, hash) => {
        if (err){
            return callback(err);
        }
        return callback(null, hash);
    })
};
UserSchema.statics.authenticate = function(email, password, callback){
    User.findOne({email: email}).exec(function (err, user) {
        if(err){
            return callback(err);
        }else if(!user){
            var error = new Error('User not found');
            error.status = 401;
            return callback(error);
        }
        bcrypt.compare(password, user.password, function (err, result) {
            if (result === true) {
              return callback(null, user);
            } else {
              return callback();
            }
        });
    });
};
var User = mongoose.model('User', UserSchema);
module.exports = User;