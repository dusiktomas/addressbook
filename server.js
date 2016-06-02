'use strict';

// core
var express = require('express');
var app = express();
var Firebase = require('firebase');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var AccountManager = require('./model/AccountManager');
var ContactManager = require('./model/ContactManager');
var StatusMessages = require('./shared/StatusMessages');
var ErrorLogger = require('./shared/ErrorLogger');
var Authorization = require('./middlewares/Authorization');

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

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

  router.use(function(req, res, next){
		// Allow for all devices and clients comunicate with our api
		res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  });

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
		router.route('/accounts').post(function(req, res){
			AccountManager.createAccount(req.body, function(err, account){
				if(err){
					switch(err.message){
						case 'REQUIRED_FIELDS_MISSING':
							return res.status(409).json(StatusMessages.REQUIRED_FIELDS_MISSING);
						case 'EMAIL_IS_NOT_VALID':
							return res.status(409).json(StatusMessages.EMAIL_IS_NOT_VALID);
						case 'EMAIL_IS_NOT_AVAILABLE':
							return res.status(409).json(StatusMessages.EMAIL_IS_NOT_AVAILABLE);
						default: 
							return res.status(500).json(StatusMessages.INTERNAL_ERROR);
					}
				}
				// we can send account info to the user @account
				res.json(StatusMessages.REGISTER_SUCCESSFULL);
			});
		});
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
			* @apiSuccess {Object} account Acciybt information 
			* @apiError REQUIRED_FIELDS_MISSING <code>409</code> Email or password is missing..
			* @apiError EMAIL_IS_NOT_VALID <code>409</code> Email address is not valid. 
			* @apiError USER_DOES_NOT_EXISTS <code>409</code> User with this credentials not exists. 
			* @apiError (Internal error 500) INTERNAL_ERROR <code>500</code> Something is wrong, please try this operation later.
		*/
		router.route('/accounts/login').post(function(req, res){
			AccountManager.loginAccount(req.body, function(err, userInfo){
				if(err){
					switch(err.message){
						case 'REQUIRED_FIELDS_MISSING':
							return res.status(409).json(StatusMessages.REQUIRED_FIELDS_MISSING);
						case 'EMAIL_IS_NOT_VALID':
							return res.status(409).json(StatusMessages.EMAIL_IS_NOT_VALID);
						case 'USER_DOES_NOT_EXISTS':
							return res.status(400).json(StatusMessages.USER_DOES_NOT_EXISTS);
						default: 
							return res.status(500).json(StatusMessages.INTERNAL_ERROR);
					}
				}
				res.json(Object.assign(StatusMessages.LOGIN_SUCCESSFULL, userInfo));
			});
		});


	/* AUTH REQUIRE ROUTES - AUTH IS NEEDED */
		// route middleware to verify a token for auth routes
		router.use(Authorization.verifyAuthToken.bind(Authorization));

		/**
			* @api {post} /api/contacts create contact for account 
			* @apiName CreateContact
			* @apiheaderexample {json} request header:
			*     {
			*       "content-type": "application/json",
			*       "x-auth-token": "authorization key "
			*     }
			*
			* @apiGroup contacts
			*
			* @apiParam {String} fullName Name and surname of contact 
			* @apiParam {String} email Email of contact
			* @apiParam {String} phone Phone number of contact
			* @apiParamExample {json} Request-Example:
			*     {
			*       "fullName": "John Newman",
			*       "email": "john.newman@gmail.com",
			*       "phone": "775 542 556",
			*     }
			* @apiSuccess {Boolean} success Was operation successfull 
			* @apiSuccess {String} code Constant for translation purposes 
			* @apiSuccess {String} message Response message 
			* @apiSuccess {Object} contact Contact information 
			* @apiError INVALID_CONTACT <code>409</code> Contact has invalid format, check email format and others...
			* @apiError NO_AUTH_TOKEN <code>403</code> Auth token is missing in headers or in json.
			* @apiError AUTH_ERROR <code>403</code> Bad auth token.
			* @apiError (Internal error 500) INTERNAL_ERROR <code>500</code> Something is wrong, please try this operation later.
		*/
		router.route('/contacts').post(function(req, res){
			if( ! req.account || ! req.account.id){
				return res.status(403).json(StatusMessages.AUTH_ERROR);
			}
			ContactManager.createContact(req.account.id, req.body, function(err, contactInfo){
				if(err){
					switch(err.message){
						case 'INVALID_CONTACT':
							return res.status(409).send(StatusMessages.INVALID_CONTACT);
						default: 
							return res.status(500).json(StatusMessages.INTERNAL_ERROR);
					}
				}
				res.json(Object.assign(StatusMessages.CONTACT_CREATE_SUCCESS, {contact: contactInfo}));
			});
		});

	// lets init router for /api
	app.use('/api', router);

	const port = process.env.PORT || 3000; 
	app.listen(port, function () {
		console.log(`AdressBook api listening on port ${port}!`);
	});
});

