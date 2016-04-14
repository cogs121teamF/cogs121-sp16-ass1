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
	//console.log(res);
	mongoose.model('Newsfeed').findOne({_id : req.body.id}).exec(function(err,newsfeeds) {
		if(err) {
	  	}
	  	if(newsfeeds != null) {
	  		newsfeeds.shameCount++;
				newsfeeds.save();
		}
		else{
		}
		res.redirect(req.get('referer'));
	});
}
