var mongoose = require('mongoose');
// var models = require("../models");


//TODO sorting by shameCount works but need to refesh
exports.view = function(req, res) {
	mongoose.model('Newsfeed').find({}).sort('-shameCount').exec(function(err,newsfeeds) {
		if(err) {
			res.render("chat", {"newsfeed": "Error loading messages"});
		}
		res.render("chat", {"newsfeed": newsfeeds});
	});
};

/*
Method for incrementing the "shame count" for each post
*/
exports.inc = function(req,res) {
	console.log("being called?");
	mongoose.model('Newsfeed').findOne({_id : req.body.id}).exec(function(err,newsfeeds) {
	  if(err) {
	  }
	  newsfeeds.shameCount++;
		newsfeeds.save();
		res.redirect(req.get('referer'));
	});
}
