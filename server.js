'use strict';

var express = require('express'),
		bodyParser = require('body-parser'),
		mongoose = require('mongoose'),
		jwt = require('jsonwebtoken'),
		Account = require('./model/Account'),
		config = require('./config'),
		StatusMessages = require('./shared/StatusMessages'),
		ErrorLogger = require('./shared/ErrorLogger'),
		Helper = require('./shared/Helper'),
		app = express();

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
// For user auth
app.set('secureSecret', config.secureSecret);

// connect to db
mongoose.connect(config.database);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
	console.log('db success');
});

var router = express.Router();

/* GLOBAL ROUTES - NO NEED TO AUTH */
// create account {POST}
router.route('/accounts').post(Helper.createAccount.bind(Helper));

// login user {POST}
router.route('/accounts/login').post(Helper.loginUser.bind(Helper));


/* AUTH REQUIRE ROUTES - AUTH IS NEEDED */
// route middleware to verify a token for auth routes
router.use(Helper.verifyAuthToken.bind(Helper));

// create contact {POST} - auth
router.route('/accounts/auth/create-contact').post(Helper.createContact.bind(Helper));

// lets init router for /api
app.use('/api', router);

const port = process.env.PORT || 3000; 
app.listen(port, function () {
  console.log(`AdressBook api listening on port ${port}!`);
});
