'use strict';

// core
var jwt = require('jsonwebtoken');

var config = require('../config');
var StatusMessages = require('../shared/StatusMessages');
var ErrorLogger = require('../shared/ErrorLogger');

/*
	* This class is helper class for account authorization helper functions
	* for better readability
	* @module Authorization
*/
class Authorization {
	/*
		* This method is in charge of verify auth token
		* @method verifyRoutes
		* @param req {Object} request
		* @param res {Object} response
		* @param next {Function} next route 
	*/
	static verifyAuthToken(req, res, next) {
		/*
			* We are considering WEB applications and mobile etc... which can send authToken 
		*/
		var token = req.headers['x-auth-token'];
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

};

module.exports = Authorization;
