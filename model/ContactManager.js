'use strict';

// core
var jwt = require('jsonwebtoken');
var Firebase = require('firebase');

var config = require('../config');
var Contact = require('./Contact');

/*
	* ContactManager for working with {Account} model
	* @module Model
*/

class ContactManager {
	/*
		* This method is in charge of creating contact for account
		* @method createContact
		* @param accountId {Number} account id
		* @param body {Object} body
		* @param cb {Function} callback 
	*/
	static createContact(accountId, data, cb) {
		var contact = new Contact(data);
		if( ! contact.isValid()){
			return cb(new Error('INVALID_CONTACT'));
		}
		var ref = Firebase.database().ref('users/' + accountId);
		ref.push().set(contact.getContactObject());
		return cb(null, contact.getContactObject());
	};
};

module.exports = ContactManager;

