'use strict';

// core
var jwt = require('jsonwebtoken');

var config = require('../config');
var Account = require('./Account');

/*
	* AccountManager for working with {Account} model
	* @module Model
*/

class AccountManager {
	/*
		* This method is in charge of creating account
		* @method createAccount
		* @param data {Object} object of account
	*/
	static createAccount(data, cb){
		var account = new Account(data);
		if( ! account.hasRequiredFields()){
			return cb(new Error('REQUIRED_FIELDS_MISSING'));
		}
		if( ! account.isEmailValid()){
			return cb(new Error('EMAIL_IS_NOT_VALID'));
		}
		account.isEmailFreeToUse(function(err){
			if(err){
				return cb(new Error('EMAIL_IS_NOT_AVAILABLE'));
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
					return cb(new Error('INTERNAL_ERROR'));
				}
				return cb(null);
			});
		});
	};

	/*
		* This method is in charge of login account
		* @method loginAccount
		* @param data {Object} login data
	*/
	static loginAccount(data, cb) {
		var account = new Account(data);
		if( ! account.hasRequiredFields()){
			return cb(new Error('REQUIRED_FIELDS_MISSING'));
		}
		if( ! account.isEmailValid()){
			return cb(new Error('EMAIL_IS_NOT_VALID'));
		}
		/*
			* Important!
			* Password was sent in plain text, we count with secure connectin (SSL...)
			* If we cannot secure our connection, consider encrypt password on client
		*/
		account.encryptPassword();
		account.validateLogin(function(err){
			if(err){
				return cb(new Error('USER_DOES_NOT_EXISTS'));
			}
			// create auth token
			const EXPIRE_TIME = '60m'; // expires in 60 minutes
			var token = jwt.sign({
				email: account.getEmail(),
				id: account.getAccountId()
			}, config.secureSecret, {
				expiresIn: EXPIRE_TIME
			});

			return cb(null, {
				user: {
					email: account.getEmail()
				},
				authToken: token
			});

		});
	};

};

module.exports = AccountManager;
