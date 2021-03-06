// Node.js Dependencies
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo/es5")(session);
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
const DB = 'mongodb://austin:austin@ds019480.mlab.com:19480/cogs121'

//require("dotenv").config();
require("dotenv").load();
var models = require("./models");

var router = {
	index: require("./routes/index"),
	chat: require("./routes/chat")
};

var parser = {
    body: require("body-parser"),
    cookie: require("cookie-parser")
};

var passport = require("passport");
var TwitterStrategy = require("passport-twitter").Strategy;

// Database Connection
var db = mongoose.connection;
mongoose.connect(process.env.MONGOLAB_URI || DB);
db.on('error', console.error.bind(console, 'Mongo DB Connection Error:'));
db.once('open', function(callback) {
    console.log("Database connected successfully.");
});

// session middleware
var session_middleware = session({
    key: "session",
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({ mongooseConnection: db })
});

// Middleware
app.set("port", process.env.PORT || 3000);
app.engine('html', handlebars({ defaultLayout: 'layout', extname: '.html' }));
app.set("view engine", "html");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));
app.use(parser.cookie());
app.use(parser.body.urlencoded({ extended: true }));
app.use(parser.body.json());
app.use(require('method-override')());
app.use(session_middleware);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "/auth/twitter/callback"
}, function(token, token_secret, profile, done) {
	models.User.findOne({ "twitterID": profile.id }, function(err, user) {
    	if(!user) {
    		models.User.create({
    		    "twitterID": profile.id,
    			"token": token,
    			"username": profile.username,
    			"displayName": profile.displayName,
    			"photo": profile.photos[0].value
    		})
        	return done(null, profile);
    	}
    	else {
        	process.nextTick(function() {
            	return done(null, profile);
        	});
    	}
  	});
}));

passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(user, done) {
	done(null, user);
});

// Routes
app.get("/", router.index.view);
app.get("/chat", router.chat.view)
app.get("/auth/twitter", passport.authenticate("twitter"));
app.get("/auth/twitter/callback", passport.authenticate("twitter", {successRedirect: '/chat', failureRedirect: '/login'}));
app.get("/logout", function(req, res) {
	req.logout();
	res.redirect('/');
});
app.post("/shameCountInc", router.chat.inc);

io.use(function(socket, next) {
    session_middleware(socket.request, {}, next);
});

/*io.on("connection", function(socket) { socket.on('chat message', function(msg){
		console.log('message: ' + msg);
	});
});*/

io.on("connection", function(socket) {
	socket.on("newsfeed", function(msg, msg2) {
		models.Newsfeed.create({
			"user": socket.request.session.passport.user.displayName,
			"message": msg,
			"picture": socket.request.session.passport.user.photos[0].value,
			"shameCount" : 0,
      "carpicture": msg2
		}, function(err, newNewsFeed) {
			//console.log("message: " + msg);
			//console.log(newNewsFeed);
			io.emit("newsfeed", newNewsFeed);
		});
	});
});

// Start Server
http.listen(process.env.PORT || app.get("port"), function() {
    console.log("Express server listening on port " + app.get("port"));
});
