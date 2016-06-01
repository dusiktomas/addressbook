# Address Book api by Thomas Dusik
Simple REST Api build on Express.

### 🔥 Code quality

Code styling is consistent (i hope so).
Accounts and Contacts are stored in model folder with the right relevant methods.
StatusMessages class handling json responses and for better readability there is a Helper.
There is more, u can check.

### 🔥 Security

Password should be encrypted
In order to secure our password in case of waterfall effect (db dump cracking passwords)
I am using "email:password" method with creating sha256 hash 

### 🔥 Testability

For testing purposes, i am using mocha with superagent + should.
These are powerfull weapons.

### API structure and usability

API is structured by defining cascading routes.
HTTP response codes should follow [rfc2616] principes.

### Development and deployment

As you can see, nothing is hard-coded.
All databases setup and configs depends on environment
You can run this app with setting the environment variables:
```
SERVICE_ACCOUNT='/home/profile/addressbook/server/adressbook-acc1e03b83c8.json' MONGO_DB='mongodb://user:pwd@ds029224.mlab.com:29224/addressbook' node server.js
```
even testing is possible
```
SERVER_URL='http://<host>:3000' mocha test-api.js
```

### New language features
Love that.
Check the code!

### Documentation

Docs are in apidocs folder.
