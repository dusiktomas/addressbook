'use strict';

/*
	* This class is in charge of handling error messages
	* @module ErrorLogger
*/
class ErrorLogger {
	/*
		* This MOCK method is prepared for loging error messages 
		* @method addErrorMessage
		* @param {String} error message
		* @return {Boolean} was operation succesfull
	*/
	static addErrorMessage(message){
		// todo
		console.log('Error message added');
		return true;
	};

	/*
		* This MOCK method is prepared for getting all error messages 
		* @method getAllErrorMessages
		* @return {Array} errors
	*/
	static getAllErrorMessages(){
		// todo
		return [];
	}

	/*
		* This MOCK method is prepared for getting concrete error message
		* @method addErrorMessage
		* @param {String} error message
		* @return {Object} error
	*/
	static getErrorMessageById(id){
		// todo
		return {};
	}
};

module.exports = ErrorLogger;
