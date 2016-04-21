var express     = require('express');
var User        = require('../models/user');
var loginModule = {};

loginModule.signup  = express.Router();
loginModule.signin  = express.Router();
loginModule.signout = express.Router();

loginModule.signup.route('/')
    .post(function(req, res){
        console.log(req.body);
        var user = new User(req.body);
        user.set('interests', req.body.interests.split(','));
        user.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Sign up successfully!' });
        });
});

loginModule.signin.post('/', function(req, res){
    console.log(req.body);
    User.findOne({username: req.body.username})
        .exec(function(err, user) {
            if (!user) {
                err = 'User Not Found!'
            } else if (user.password == req.body.password) {
                res.json({ message: 'Sign in successfully!' });
//                res.redirect('/dashboard');
            } else {
                err = 'Authentication Failed!'
            }

            if (err) {
                res.json({ message: err });
//                res.redirect('/signin');
            }

        });
});

loginModule.signout.all('/', function(req, res){
    console.log(req.body);
    res.json({ message: 'Sign out successfully!' });
});

module.exports = loginModule;
