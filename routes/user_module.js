var express     = require('express');
var User        = require('../models/user');
var Group       = require('../models/group');
var userModule  = {};

userModule.createGroup      = express.Router();
userModule.joinGroup        = express.Router();
// userModule.updateGroup      = express.Router();
userModule.deleteGroup      = express.Router();
userModule.withdrawGroup    = express.Router();
userModule.searchGroups     = express.Router();
// userModule.recommendGroup   = express.Router();
userModule.ownGroups        = express.Router();
userModule.joinedGroups     = express.Router();
userModule.listGroups       = express.Router();
userModule.getGmail         = express.Router();
userModule.getProfile       = express.Router();
userModule.updateProfile    = express.Router();

userModule.createGroup.post('/:username', function(req, res){
    console.log(req.body);
    console.log(req.params);
    var group = new Group();
    group.set('groupname', req.body.groupname);
    group.set('groupowner', req.params.username);
    group.set('groupmembers', req.params.username);
    group.set('grouptags', req.body.grouptags.split(','));
    group.save();

    User.findOne({ username: req.params.username }, function(err, user) {
        console.log(user);
        user.groupsOwn.push(req.body.groupname);
        user.groupsIn.push(req.body.groupname);
        user.save();
    });
    res.json({ message: 'Create Group Successfully!' });   
});

userModule.joinGroup.post('/:username', function(req, res){
    console.log(req.body);
    Group.findOne({ groupname: req.body.groupname }, function(err, group) {
        group.groupmembers.push(req.params.username);
        group.save();
    });

    User.findOne({ username: req.params.username }, function(err, user) {
        user.groupsJoin.push(req.body.groupname);
        user.groupsIn.push(req.body.groupname);
        user.save();
    });
    res.json({ message: 'Join Group Successfully!' });
});

userModule.ownGroups.get('/:username', function(req, res){
    console.log(req.body);
    User.findOne({ username: req.params.username }, function(err, user) {
        res.json(user.groupsOwn);
    });    
});

userModule.joinedGroups.get('/:username', function(req, res){
    console.log(req.body);
    User.findOne({ username: req.params.username }, function(err, user) {
        res.json(user.groupsJoin);
    });    
});

userModule.listGroups.get('/:username', function(req, res){
    console.log(req.body);
    User.findOne({ username: req.params.username }, function(err, user) {
        res.json(user.groupsIn);
    });    
});

userModule.getGmail.get('/:username', function(req, res){
    console.log(req.body);
    User.findOne({ username: req.params.username }, function(err, user) {
        res.json(user.gmail);
    });    
});

userModule.getProfile.get('/:username', function(req, res){
    console.log(req.body);
    User.findOne({ username: req.params.username }, function(err, user) {
        res.json(user);
    });    
});

userModule.updateProfile.post('/:username', function(req, res){
    console.log(req.body);
    User.findOne({ username: req.params.username }, function(err, user) {
        user.set('password', req.body.password);
        user.set('interests', req.body.interests.split(','));
        user.save();
    });
    res.json({ message: 'User Update Successfully!' });
});

userModule.deleteGroup.delete('/:groupname', function(req, res){

    Group.findOne({ groupname: req.params.groupname }, function(err, group) {
        console.log(group.groupname);
        if (group.groupmembers.length > 1) {
            for (i = 1; i < group.groupmembers.length; i++) {
                User.findOne({ username: group.groupmembers[i] }, function(err, user) {
                    var index1 = user.groupsIn.indexOf(group.groupname);
                    if (index1 > -1 ) {
                        console.log(user.groupsIn);
                        user.groupsIn.splice(index1, 1);
                        console.log(user.groupsIn);
                    }

                    var index2 = user.groupsJoin.indexOf(group.groupname);
                    if (index2 > -1 ) {
                        console.log(user.groupsIn);
                        user.groupsJoin.splice(index2, 1);
                        console.log(user.groupsIn);
                    }

                    user.save();
                });
            }
        }

        User.findOne({ username: group.groupowner }, function(err, user) {

            console.log(user);
            // console.log(group.groupname);
            var index1 = user.groupsIn.indexOf(group.groupname);
            console.log(index1);
            if (index1 > -1 ) {
                console.log(user.groupsIn);
                user.groupsIn.splice(index1, 1);
                console.log(user.groupsIn);
            }

            var index2 = user.groupsOwn.indexOf(group.groupname);
            console.log(index2);
            if (index2 > -1 ) {
                console.log(user.groupsOwn);
                user.groupsOwn.splice(index2, 1);
                console.log(user.groupsOwn);
            }
            user.save();
        });

    });  

    Group.remove({ groupname: req.params.groupname }, function(err, group) {
        if (err) {
            res.send(err);
        } else {
            res.json({ message: 'Delete Successfully!' });
        }
    });  
});

userModule.withdrawGroup.post('/:groupname/:username', function(req, res){
    
    Group.findOne({ groupname: req.params.groupname }, function(err, group) {

        var index = group.groupmembers.indexOf(req.params.username);
        group.groupmembers.splice(index, 1);
        group.save();

    });

    User.findOne({ username: req.params.username }, function(err, user) {
        var index1 = user.groupsIn.indexOf(req.params.groupname);
        if (index1 > -1 ) {
            console.log(user.groupsIn);
            user.groupsIn.splice(index1, 1);
            console.log(user.groupsIn);
        }

        var index2 = user.groupsJoin.indexOf(req.params.groupname);
        if (index2 > -1 ) {
            console.log(user.groupsJoin);
            user.groupsJoin.splice(index2, 1);
            console.log(user.groupsJoin);
        }

        user.save();
    });

    res.json({ message: 'Remove Successfully!' });
 
});

userModule.searchGroups.get('/:keyword', function(req, res) {

    Group.find({ grouptags: req.params.keyword }).limit(10).exec(function(err, groups) {

        if (err) {
            res.send(err);
        } else {

        var groupsFound = [];

        for (i = 0; i < groups.length; i++) {

            groupsFound.push(groups[i].groupname);
        }

        res.json(groupsFound);

        }
    });

});

module.exports = userModule;
