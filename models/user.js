var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSChema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSChema.pre('save', function (next) {
    var user = this;
    if(this.isModified('password' || this.isNew)) {
        bcrypt.genSalt(10, function (err, salt) {
            if(err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function(err, hash) {
                if(err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSChema.methods.comparePassword = function(password, callbackFunc) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if(err) {
            return callbackFunc(err);
        }
        callbackFunc(null, isMatch);
    })
}

module.exports = mongoose.model("User", UserSChema);