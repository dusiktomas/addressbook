'use strict';

/*
	* This module is in charge of handling status messages
	* @module StatusMessages
*/
const StatusMessages = {
	EMAIL_IS_NOT_VALID: {
		status: false,
		error: {
			code: 'EMAIL_IS_NOT_VALID',
			message: 'Email is not valid, please try again with another one.'
		}
	},
	REQUIRED_FIELDS_MISSING: {
		status: false,
		error: {
			code: 'REQUIRED_FIELDS_MISSING',
			message: 'Email or password is missing.'
		}
	},
	EMAIL_IS_NOT_AVAILABLE: {
		status: false,
		error: {
			code: 'EMAIL_IS_NOT_AVAILABLE',
			message: 'Email is not available.'
		}
	},
	USER_DOES_NOT_EXISTS: {
		status: false,
		error: {
			code: 'USER_DOES_NOT_EXISTS',
			message: 'User with this email and password does not exists.'
		}
	}

};

module.exports = StatusMessages;
