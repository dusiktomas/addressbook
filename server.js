'use strict';

var express = require('express'),
		bodyParser = require('body-parser'),
		mongoose = require('mongoose'),
		jwt = require('jsonwebtoken'),
		Account = require('./model/Account'),
		config = require('./config'),
		StatusMessages = require('./shared/StatusMessages'),
		ErrorLogger = require('./shared/ErrorLogger'),
		app = express();

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
// For user auth
app.set('secureSecret', config.secureSecret);

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
				return res.send(500).json(StatusMessages.INTERNAL_ERROR);
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
					return res.send(500).json(StatusMessages.INTERNAL_ERROR);
				}
				res.json(StatusMessages.REGISTER_SUCCESSFULL);
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
			// create auth token
			var token = jwt.sign({
				email: account.getEmail(),
				id: account.getAccountId()
			}, app.get('secureSecret'), {
				expiresIn: '60m' // expires in 60 minutes
			});

			res.json(Object.assign(StatusMessages.LOGIN_SUCCESSFULL, {
				authToken: token
			}));
		});
	})

// route middleware to verify a token for auth routes
router.use(function(req, res, next) {
	// Allow for all devices and clients comunicate with our api
	res.setHeader("Access-Control-Allow-Origin", "*");
	/*
		* We are considering WEB applications and mobile etc... which can send authToken 
		* in json or in headers
	*/
	var token = req.body.authToken || req.headers['x-auth-token'];
	if( ! token){
		return res.status(403).send(StatusMessages.NO_AUTH_TOKEN);
	}

	jwt.verify(token, app.get('secureSecret'), function(err, decoded) {
		if(err){
			return res.status(403).send(StatusMessages.AUTH_ERROR);
		}
		req.account = decoded;
		// continue routing
		next();
	});

});

router.route('/accounts/auth/create-contact')

	// Create new address
	.post(function (req, res) {
		var account = req.account;
		console.log(account);
		res.json({foo: 'bar'});
	})

// lets init router for /api
app.use('/api', router);

const port = process.env.PORT || 3000; 
app.listen(port, function () {
  console.log(`AdressBook api listening on port ${port}!`);
});
