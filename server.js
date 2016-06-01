'use strict';

var express = require('express'),
		Firebase = require('firebase'),
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
mongoose.connect(process.env.MONGO_DB || 'mongodb://localhost:27017/test');
// connect to FireBase
Firebase.initializeApp({
  serviceAccount: process.env.SERVICE_ACCOUNT || '/home/thomas/Documents/projects/addressbook/adressbook-acc1e03b83c8.json',
  databaseURL: process.env.FIREBASE_DB || 'https://adressbook-65009.firebaseio.com/'
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
	console.log('db success');
	var router = express.Router();

	/* GLOBAL ROUTES - NO NEED TO AUTH */
		/**
		 * @api {post} /api/accounts create account 
		 * @apiName CreateAccount
		 * @apiHeaderExample {json} Request Header:
		 *     {
		 *       "Content-Type": "application/json"
		 *     }
		 * @apiGroup accounts
		 *
		 * @apiParam {String} email Email for auth
		 * @apiParam {String} password Password for auth 
		 * @apiParamExample {json} Request-Example:
		 *     {
		 *       "email": "john.newman@gmail.com",
		 *       "password": "test"
		 *     }
		 * @apiSuccess {Boolean} success Was operation successfull 
		 * @apiSuccess {String} code Constant for translation purposes 
		 * @apiSuccess {String} message Response message 
		 * @apiError REQUIRED_FIELDS_MISSING <code>409</code> Email or password is missing..
		 * @apiError EMAIL_IS_NOT_VALID <code>409</code> Email address is not valid. 
		 * @apiError EMAIL_IS_NOT_AVAILABLE <code>409</code> Email is in use. 
		 * @apiError (Internal error 500) INTERNAL_ERROR <code>500</code> Something is wrong, please try this operation later.
		 */
		router.route('/accounts').post(Helper.createAccount.bind(Helper));
		/**
		 * @api {post} /api/accounts/login login account 
		 * @apiName LoginAccount
		 * @apiHeaderExample {json} Request Header:
		 *     {
		 *       "Content-Type": "application/json"
		 *     }
		 * @apiGroup accounts
		 *
		 * @apiParam {String} email Email for auth
		 * @apiParam {String} password Password for auth 
		 * @apiParamExample {json} Request-Example:
		 *     {
		 *       "email": "john.newman@gmail.com",
		 *       "password": "test"
		 *     }
		 * @apiSuccess {Boolean} success Was operation successfull 
		 * @apiSuccess {String} code Constant for translation purposes 
		 * @apiSuccess {String} message Response message 
		 * @apiSuccess {String} authToken Auth token for authentication to the server 
		 * @apiError REQUIRED_FIELDS_MISSING <code>409</code> Email or password is missing..
		 * @apiError EMAIL_IS_NOT_VALID <code>409</code> Email address is not valid. 
		 * @apiError USER_DOES_NOT_EXISTS <code>409</code> User with this credentials not exists. 
		 * @apiError (Internal error 500) INTERNAL_ERROR <code>500</code> Something is wrong, please try this operation later.
		 */
		router.route('/accounts/login').post(Helper.loginUser.bind(Helper));


	/* AUTH REQUIRE ROUTES - AUTH IS NEEDED */
		// route middleware to verify a token for auth routes
		router.use(Helper.verifyAuthToken.bind(Helper));

		/**
		 * @api {post} /api/accounts/auth/create-contact create contact for account 
		 * @apiName CreateContact
		 * @apiheaderexample {json} request header:
		 *     {
		 *       "content-type": "application/json",
		 *       "x-auth-token": "authorization key " (you can pass it here or to json in body)
		 *     }
		 *
		 * @apiGroup auth
		 *
		 * @apiParam {String} fullName Name and surname of contact 
		 * @apiParam {String} email Email of contact
		 * @apiParam {String} phone Phone number of contact
		 * @apiParamExample {json} Request-Example:
		 *     {
		 *       "fullName": "John Newman",
		 *       "email": "john.newman@gmail.com",
		 *       "phone": "775 542 556",
		 *       "authToken": "authorization key" (you can pass it here or to headers)
		 *     }
		 * @apiSuccess {Boolean} success Was operation successfull 
		 * @apiSuccess {String} code Constant for translation purposes 
		 * @apiSuccess {String} message Response message 
		 * @apiError INVALID_CONTACT <code>409</code> Contact has invalid format, check email format and others...
		 * @apiError NO_AUTH_TOKEN <code>403</code> Auth token is missing in headers or in json.
		 * @apiError AUTH_ERROR <code>403</code> Bad auth token.
		 */
		router.route('/accounts/auth/create-contact').post(Helper.createContact.bind(Helper));

	// lets init router for /api
	app.use('/api', router);

	const port = process.env.PORT || 3000; 
	app.listen(port, function () {
		console.log(`AdressBook api listening on port ${port}!`);
	});
});

