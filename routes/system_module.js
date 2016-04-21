var express       = require('express');
var User          = require('../models/user');
var Group         = require('../models/group');
var systemModule  = {};

systemModule.recommendGroups = express.Router();

systemModule.recommendGroups.get('/:username', function(req, res) {

	var groupsFound = [];

	User.findOne({ username: req.params.username }, function(err, user) {
		console.log(user.interests);

		for (i = 0; i < user.interests.length; i++) {

			console.log(user.interests[i]);

			// Group.find({ grouptags: { $in: user.interests } }).limit(10).exec(function(err, groups) {
			Group.find({ grouptags: user.interests[i] }).limit(5).exec(function(err, groups) {
				console.log(groups);

				if (err) {
		            res.send(err);
		        } else {

					for (i = 0; i < groups.length; i++) {

						groupsFound.push(groups[i].groupname);
						console.log(groupsFound);
					}
		        }		    
			});

		}

	});

	setTimeout(function() {
    	res.json(groupsFound);
	}, 100);
	
});


module.exports = systemModule;