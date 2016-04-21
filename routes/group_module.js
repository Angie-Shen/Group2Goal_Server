var express     = require('express');
var Group       = require('../models/group');
var groupModule  = {};

groupModule.listUsers = express.Router();
groupModule.showGroup = express.Router();

groupModule.listUsers.get('/:groupname', function(req, res){
    console.log(req.params);
    Group.findOne({ groupname: req.params.groupname }, function(err, group) {
        res.json(group.groupmembers);
    });    
});

groupModule.showGroup.get('/:groupname', function(req, res) {
	console.log(req.params);
    Group.findOne({ groupname: req.params.groupname }, function(err, group) {
        res.json(group);
    });    	
});

module.exports = groupModule;