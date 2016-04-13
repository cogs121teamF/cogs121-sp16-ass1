var mongoose = require('mongoose');
// var models = require("../models");

exports.view = function(req, res) {
	mongoose.model('Newsfeed').find(function(err,newsfeeds) {
		if(err) {
			res.render("chat", {"newsfeed": "Error loading messages"});
		}
		res.render("chat", {"newsfeed": newsfeeds});
	});
};
