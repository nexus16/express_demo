var mongoose = require('mongoose');
var passport = require('passport');
require('../config/passport')(passport);
var config = require('../config/database');
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require('../models/user');
var Book = require('../models/book');
var bcrypt = require('bcrypt-nodejs');

router.post('/signup', function(req, res) {
    if(!req.body.username || !req.body.password) {
        res.json({success: false, mgs: 'input username password'});
    } else {
        var newUser = new User({
            username: req.body.username,
            password: req.body.password
        });
        newUser.save(function(err) {
            if(err) {
                return res.json(err);
            }
            res.json({success: true, mgs: "Successfull created user"});
        });
    }
});


router.get('/list-user', function(req, res) {
    User.find({}, function(err, users){
        if(err) {
            res.json(err);
        } else {
            res.json(users);
        }
    });
});

router.post('/signin', function(req, res) {
    User.findOne({username: req.body.username}, function(err, user) {
        if(err) throw err;
        if(!user) {
            res.status(401).send({success: false, mgs: 'User is not existed'});
        } else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                console.log(err);
                if(isMatch && !err) {
                    var token = jwt.sign(user.toObject(), config.secret);
                    res.json({success: true, token: "JWT "+token});
                } else {
                    res.status(401).send({success: false, mgs: 'Authentication false'});
                }
            });
        }
    });
})

router.post('/book', passport.authenticate('jwt', {session: false}), function(req, res) {
    var token = getToken(req.headers);
    if(token) {
        console.log(req.body);
        var newBook = new Book({
            isbn: req.body.isbn,
            title: req.body.title,
            author: req.body.author,
            publisher: req.body.publisher
        });

        newBook.save(function(err) {
            if(err) {
                return res.json({success: false, mgs: 'Save book false'});
            }
            res.json({success: true, mgs: "Save book success"});
        })
    } else {
        return res.status(403).send({success: false, mgs: "Unauthorized"});
    }
})

router.get('/book', passport.authenticate('jwt', {session: false}), function(req, res) {
    var token = getToken(req.headers);
    console.log(token);
    if(token) {
        Book.find(function(err, books) {
            if(err) return next(err);
            res.json(books);
        })
    } else {
        return res.status(403).send({success: false, mgs: "Unauthorized ahihi"});
    }
})

getToken = function (headers) {
    if(headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if(parted.length == 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
}

module.exports = router;