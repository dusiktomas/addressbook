'use strict';

var express = require('express'),
		bodyParser = require('body-parser'),
		mongoose = require('mongoose'),
		Account = require('./model/Account'),
		config = require('./config'),
		StatusMessages = require('./shared/StatusMessages'),
		ErrorLogger = require('./shared/ErrorLogger'),
		app = express();

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// connect to db
mongoose.connect(config.database);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
	console.log('db success');
});

var router = express.Router();

router.route('/accounts')
	// READ 
	.get(function (req, res) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		Account.find(function(err, accounts){
			if(err) {
				// Log this situation
				ErrorLogger.addErrorMessage(err);
				return res.json({status: false});
			}
			res.json(accounts.map(function(item){
				return {
					id: item._id,
					email: item.email
				}
			}));
		});
	})

	// CREATE
	.post(function (req, res) {
		// Allow for all devices and clients comunicate with our api
		res.setHeader("Access-Control-Allow-Origin", "*");
		var account = new Account(req.body);
		if( ! account.hasRequiredFields()){
			return res.json(StatusMessages.REQUIRED_FIELDS_MISSING);
		}
		if( ! account.isEmailValid()){
			return res.json(StatusMessages.EMAIL_IS_NOT_VALID);
		}
		account.isEmailFreeToUse(function(err){
			if(err){
				return res.json(StatusMessages.EMAIL_IS_NOT_AVAILABLE);
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
					return res.json({status: false});
				}
				res.json({status: true});
			});
		});
	})

router.route('/accounts/login')
	// LOGIN USER
	.post(function (req, res) {
		// Allow for all devices and clients comunicate with our api
		res.setHeader("Access-Control-Allow-Origin", "*");
		var account = new Account(req.body);
		if( ! account.hasRequiredFields()){
			return res.json(StatusMessages.REQUIRED_FIELDS_MISSING);
		}
		if( ! account.isEmailValid()){
			return res.json(StatusMessages.EMAIL_IS_NOT_VALID);
		}
		/*
			* Important!
			* Password was sent in plain text, we count with secure connectin (SSL...)
			* If we cannot secure our connection, consider encrypt password on client
		*/
		account.encryptPassword();
		account.validateLogin(function(err){
			if(err){
				return res.json(StatusMessages.USER_DOES_NOT_EXISTS);
			}
			res.json({status: true});
		});
	})

app.use('/api', router);

app.listen(3000, function () {
  console.log('AdressBook api listening on port 3000!');
});
