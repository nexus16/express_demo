var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require('../models/user');
var Book = require('../models/book');

router.post('/signup', function(req, res) {
    if(!req.body.username || !req.body.password) {
        res.json({success: false, mgs: 'input username password'});
    } else {
        var newUser = new User({
            username: req.body.username,
            passport: req.body.passport
        });
        newUser.save(function(err) {
            if(err) {
                return res.json({success: false, mgs: 'Username already exixted'});
            }
            res.json({success: true, mgs: "Successfull created user"});
        });
    }
});

router.post('/signin', function(req, res) {
    User.findOne({username: req.body.username}, function(err, user) {
        if(err) throw err;
        if(!user) {
            res.status(401).send({success: false, mgs: 'Authentication false'});
        } else {
            user.comparePassword(req.body.passport, function (err, isMatch) {
                if(isMatch && !err) {
                    var token = jwt.sign(user, config.secret);
                    res.json({success: true, token: 'JWT'+ token});
                } else {
                    res.status(401).send({success: false, mgs: 'Authentication false'});
                }
            });
        }
    });
})

route.post('/book', passport.authenticate('jwt', {session: false}), function(req, res) {
    var token = getToken(req.headers);
    if(token) {
        
    }
})