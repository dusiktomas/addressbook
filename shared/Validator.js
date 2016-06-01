'use strict';

/*
	* This class is in charge of validate stuff
	* @module Validator
*/
class Validator {
  /*
    * This method is for email validation 
    * @method isEmailValid
    * @return {Boolean} is email address valid
  */
  static isEmailValid(email){
    /*
     * Just do simple regex test
     * No, guarantee that email box exists
    */
    return email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/);
  };

};

module.exports = Validator;

