'use strict';
/*
	* Account model (Active Record)
	* @module Model
*/

// components
var mongoose = require('mongoose');
var ErrorLogger = require('../shared/ErrorLogger');
var Validator = require('../shared/Validator');
var crypto = require('crypto');

var accountSchema = mongoose.Schema({
	email: String,
	password: String  // plain text password will be encrypted
});

/*
	* Getter for account id 
	* @method getAccountId
	* @return {String} account Id 
*/
accountSchema.methods.getAccountId = function(){
	return this._id;
};

/*
	* Getter for email 
	* @method getEmail
	* @return {String} email 
*/
accountSchema.methods.getEmail = function(){
	return this.email;
};


/*
	* This method is for model validation 
	* @method hasRequiredFields
	* @return {Boolean} has required fields 
*/
accountSchema.methods.hasRequiredFields = function(){
	return this.email && this.email.length > 0 
		&& this.password && this.password.length > 0
	;
};

/*
	* Check if login is free to use 
	* @method isEmailFreeToUse
	* @param {Function} callback 
*/
accountSchema.methods.isEmailFreeToUse = function(cb){
	Account.find({email: this.email}, function(err, emails){
		if(err){
			return cb(err);
		}
		if(emails.length === 0){
			// yea, that is ok
			return cb(null);
		}
		// that is not ok
		var errorMessage = 'Fatal error: more than one email in DB!'; 
		ErrorLogger.addErrorMessage(errorMessage);
		return cb(new Error(errorMessage));
	});
};

/*
	* Check if user exists with credentials
	* @method validateLogin
	* @param {Function} callback 
*/
accountSchema.methods.validateLogin = function(cb){
	Account.find({email: this.email, password: this.password}, function(err, emails){
		if(err){
			return cb(err);
		}
		if(emails.length === 0){
			// user does not exists
			return cb(new Error('User does not exists'));
		}
		if(emails.length > 1){
			// that is not ok, just pretend user does not exists and fix this!
			var errorMessage ='Fatal error: more than one email in DB!'; 
			ErrorLogger.addErrorMessage(errorMessage);
			return cb(new Error(errorMessage));
		}
		// user exists
		cb(null);
	});
};

/*
	* This method is for email validation 
	* @method isEmailValid
	* @return {Boolean} is email address valid
*/
accountSchema.methods.isEmailValid = function(){
  return Validator.isEmailValid(this.email);
};

/*
	* This method is in charge of encrypting password
	* @method encryptPassword
	* @return {Boolean} was operation succesfull 
*/
accountSchema.methods.encryptPassword = function(){
	/*
		* Password should be encrypted
		* In order to secure our password in case of rainbow (db dump cracking passwords)
		* we use "email:password" method with creating sha256 hash 
		* 
	*/
	this.password = crypto.createHash('sha256').update(this.email + ':' + this.password).digest('hex').toLowerCase();
	return true;
};

var Account = mongoose.model('Account', accountSchema);

module.exports = Account;
