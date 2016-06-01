'use strict';

var Validator = require('../shared/Validator');
/*
	* Contact model
	* @module Contact
*/
class Contact {
	/*
		* Constructor for contact 
		* @method constructor
		* @param {Object} fullName, email, phone
	*/
	constructor(obj){
		this.fullName = obj.fullName;
		this.email = obj.email;
		this.phone = obj.phone;
	}

	/*
		* Getter for account id 
		* @method isValid
		* @return {Boolean} is valid 
	*/
	isValid(){
		if( ! this.fullName || ! this.email || ! this.phone){
			return false;
		}
		if( ! Validator.isEmailValid(this.email)){
			return false;
		}
		return typeof this.fullName === "string"
			&& typeof this.email === "string"
			&& typeof this.phone === "string"
	}

	/*
		* Getter for contact object
		* @method getContactObject
		* @return {Object}
	*/
	getContactObject(){
		return {
			fullName: this.fullName,
			email: this.email,
			phone: this.phone
		}
	}
}

module.exports = Contact;
