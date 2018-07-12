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
        type: string,
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

module.exports = mongoose.model("User", UserSChema);