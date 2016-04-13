const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    "twitterID": String,
    "token": String,
    "username": String,
    "displayName": String,
    "photo": String
});

const NewsFeedSchema = new Schema({
	"user": String,
	"message": String,
	"picture": String,
  "shameCount" : Number,
	"posted": { type: Date, default: Date.now }
});

exports.User = mongoose.model('User', UserSchema);
exports.Newsfeed = mongoose.model('Newsfeed', NewsFeedSchema);
