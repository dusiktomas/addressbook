var supertest = require('supertest');
var randomstring = require('randomstring');
var should = require('should');

var server = supertest.agent(process.env.SERVER_URL || "http://localhost:3000");

describe('API Test',function(){

	describe('Accounts route testing: ', function(){

		it('Create account, should return status 409 and success false, code: REQUIRED_FIELDS_MISSING',function(done){
			server
			.post("/api/accounts")
			.expect("content-type", 'application/json')
			.end(function(err,res){
				res.status.should.equal(409);
				res.body.success.should.equal(false);
				res.body.code.should.equal('REQUIRED_FIELDS_MISSING');
				done();
			});
		});

		it('Create account, Should return status 409 and success false, code: EMAIL_IS_NOT_VALID',function(done){
			server
			.post("/api/accounts")
			.send({ email: 'tempz', password: 'test'})
			.expect("content-type", 'application/json')
			.end(function(err,res){
				res.status.should.equal(409);
				res.body.success.should.equal(false);
				res.body.code.should.equal('EMAIL_IS_NOT_VALID');
				done();
			});
		});

		it('Create contact, Should return status 403 and success false, NO_AUTH_TOKEN',function(done){
			server
			.post("/api/contacts")
			.send({ fullName: 'Ferda Novaku', email: 'testssl@gmail.com', phone: '797 645 156'})
			.expect("content-type", 'application/json')
			.end(function(err,res){
				res.status.should.equal(403);
				res.body.success.should.equal(false);
				res.body.code.should.equal('NO_AUTH_TOKEN');
				authToken = res.body.authToken;
				done();
			});
		});

		it('Create contact, Should return status 403 and success false, AUTH_ERROR',function(done){
			server
			.post("/api/contacts")
			.set({'x-auth-token': 'asdasdjasdkansdkjasdjkasdjasad'})
			.send({ fullName: 'Ferda Novaku', email: 'testssl@gmail.com', phone: '797 645 156'})
			.expect("content-type", 'application/json')
			.end(function(err,res){
				res.status.should.equal(403);
				res.body.success.should.equal(false);
				res.body.code.should.equal('AUTH_ERROR');
				authToken = res.body.authToken;
				done();
			});
		});
		
		

		it('Create account, Should return status 409 and success false, code: REQUIRED_FIELDS_MISSING',function(done){
			server
			.post("/api/accounts")
			.send({ email: '', password: ''})
			.expect("content-type", 'application/json')
			.end(function(err,res){
				res.status.should.equal(409);
				res.body.success.should.equal(false);
				res.body.code.should.equal('REQUIRED_FIELDS_MISSING');
				done();
			});
		});

		describe('operations: ', function(){

			var randomEmail = randomstring.generate(16) + '@gmail.com';
			var authToken = ''; // will be filled

			it('Should create account and return status 200 and success true',function(done){

				server
				.post("/api/accounts")
				.send({ email: randomEmail, password: 'test'})
				.expect("content-type", 'application/json')
				.end(function(err,res){
					res.status.should.equal(200);
					res.body.success.should.equal(true);
					res.body.code.should.equal('REGISTER_SUCCESSFULL');
					done();
				});
			});

			it('Should log account and return status 200 and success true',function(done){
				server
				.post("/api/accounts/login")
				.send({ email: randomEmail, password: 'test'})
				.expect("content-type", 'application/json')
				.end(function(err,res){
					res.status.should.equal(200);
					res.body.success.should.equal(true);
					res.body.code.should.equal('LOGIN_SUCCESSFULL');
					res.body.authToken.should.be.type('string');
					authToken = res.body.authToken;
					done();
				});
			});

			it('Should create contact and return status 200 and success true',function(done){
				server
				.post("/api/contacts")
				.set({'x-auth-token': authToken})
				.send({ fullName: 'Ferda Novaku', email: 'testssl@gmail.com', phone: '797 645 156'})
				.expect("content-type", 'application/json')
				.end(function(err,res){
					res.status.should.equal(200);
					res.body.success.should.equal(true);
					res.body.code.should.equal('CONTACT_CREATE_SUCCESS');
					authToken = res.body.authToken;
					done();
				});
			});
		
		
		
		});

	
	
	});

});
