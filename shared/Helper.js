'use strict';

var jwt = require('jsonwebtoken'),
		Firebase = require('firebase'),
		Contact = require('../model/Contact'),
		Account = require('../model/Account'),
		config = require('../config'),
		StatusMessages = require('./StatusMessages'),
		ErrorLogger = require('./ErrorLogger');
/*
	* This class is only helper class for helper functions
	* for better readability
	* @module Helper
*/
class Helper {

	/*
		* This method is in charge of creating account
		* @method module
		* @param req {Object} request
		* @param res {Object} response
	*/
	static createAccount(req, res){
		// Allow for all devices and clients comunicate with our api
		res.setHeader("Access-Control-Allow-Origin", "*");
		var account = new Account(req.body);
		if( ! account.hasRequiredFields()){
			return res.status(409).json(StatusMessages.REQUIRED_FIELDS_MISSING);
		}
		if( ! account.isEmailValid()){
			return res.status(409).json(StatusMessages.EMAIL_IS_NOT_VALID);
		}
		account.isEmailFreeToUse(function(err){
			if(err){
				return res.status(409).json(StatusMessages.EMAIL_IS_NOT_AVAILABLE);
			}
			/*
				* Important!
				* Password was sent in plain text, we count with secure connectin (SSL...)
				* If we cannot secure our connection, consider encrypt password on client
			*/
			account.encryptPassword();
			account.save(function(err){
				if(err){
					// Log this situation
					ErrorLogger.addErrorMessage(err);
					return res.status(500).json(StatusMessages.INTERNAL_ERROR);
				}
				res.json(StatusMessages.REGISTER_SUCCESSFULL);
			});
		});
	};

	/*
		* This method is in charge of login account
		* @method loginUser
		* @param req {Object} request
		* @param res {Object} response
	*/
	static loginUser(req, res) {
		// Allow for all devices and clients comunicate with our api
		res.setHeader("Access-Control-Allow-Origin", "*");
		var account = new Account(req.body);
		if( ! account.hasRequiredFields()){
			return res.status(409).json(StatusMessages.REQUIRED_FIELDS_MISSING);
		}
		if( ! account.isEmailValid()){
			return res.status(409).json(StatusMessages.EMAIL_IS_NOT_VALID);
		}
		/*
			* Important!
			* Password was sent in plain text, we count with secure connectin (SSL...)
			* If we cannot secure our connection, consider encrypt password on client
		*/
		account.encryptPassword();
		account.validateLogin(function(err){
			if(err){
				return res.status(400).json(StatusMessages.USER_DOES_NOT_EXISTS);
			}
			// create auth token
			const EXPIRE_TIME = '60m'; // expires in 60 minutes
			var token = jwt.sign({
				email: account.getEmail(),
				id: account.getAccountId()
			}, config.secureSecret, {
				expiresIn: EXPIRE_TIME
			});

			res.json(Object.assign(StatusMessages.LOGIN_SUCCESSFULL, {
				authToken: token
			}));
		});
	};

	/*
		* This method is in charge of verify auth token
		* @method verifyRoutes
		* @param req {Object} request
		* @param res {Object} response
		* @param next {Function} next route 
	*/
	static verifyAuthToken(req, res, next) {
		// Allow for all devices and clients comunicate with our api
		res.setHeader("Access-Control-Allow-Origin", "*");
		/*
			* We are considering WEB applications and mobile etc... which can send authToken 
			* in body {JsonFormat} or in headers
		*/
		var token = req.body.authToken || req.headers['x-auth-token'];
		if( ! token){
			return res.status(403).send(StatusMessages.NO_AUTH_TOKEN);
		}

		// Verify auth token with our private key
		jwt.verify(token, config.secureSecret, function(err, decoded) {
			if(err){
				return res.status(403).send(StatusMessages.AUTH_ERROR);
			}
			// success, user is verified
			req.account = decoded;
			// continue routing
			next();
		});
	};

	/*
		* This method is in charge of creating contact for user
		* @method createContact
		* @param req {Object} request
		* @param res {Object} response
	*/
	static createContact(req, res) {
		var account = req.account;
		var contact = new Contact(req.body);
		if( ! contact.isValid()){
			return res.status(409).send(StatusMessages.INVALID_CONTACT);
		}
		var ref = Firebase.database().ref('users/' + account.id);
		ref.push().set(contact.getContactObject());
    return res.send(StatusMessages.CONTACT_CREATE_SUCCESS);
	};
};

module.exports = Helper;
