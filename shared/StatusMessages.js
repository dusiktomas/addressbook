'use strict';
/*
	* This module is in charge of handling status messages
	* @module StatusMessages
*/
const StatusMessages = {
	/*
		* @param success {Boolean} was operation successfull
		* @param code {String} CONST for translating error on device
		* @param message {String} error message
	*/
	EMAIL_IS_NOT_VALID: {
		success: false,
		code: 'EMAIL_IS_NOT_VALID',
		message: 'Email is not valid, please try again with another one.'
	},
	REQUIRED_FIELDS_MISSING: {
		success: false,
		code: 'REQUIRED_FIELDS_MISSING',
		message: 'Email or password is missing.'
	},
	EMAIL_IS_NOT_AVAILABLE: {
		success: false,
		code: 'EMAIL_IS_NOT_AVAILABLE',
		message: 'Email is not available.'
	},
	USER_DOES_NOT_EXISTS: {
		success: false,
		code: 'USER_DOES_NOT_EXISTS',
		message: 'User with this email and password does not exists.'
	},
	INTERNAL_ERROR: {
		success: false,
		code: 'INTERNAL_ERROR',
		message: 'Something is wrong, please try this operation later.'
	},
	AUTH_ERROR: {
		success: false,
		code: 'AUTH_ERROR',
		message: 'Bad auth token'
	},
	NO_AUTH_TOKEN: {
		success: false,
		code: 'NO_AUTH_TOKEN',
		message: 'Auth token is missing in headers or in json'
	},
	LOGIN_SUCCESSFULL: {
		success: true,
		code: 'LOGIN_SUCCESSFULL',
		message: 'User was successfully logged in.'
	},
	REGISTER_SUCCESSFULL: {
		success: true,
		code: 'REGISTER_SUCCESSFULL',
		message: 'User was register.'
	}
};

module.exports = StatusMessages;
