# Address Book api by Thomas Dusik
Simple REST Api build on Express.

### 🔥 Code quality

Code styling is consistent and follow RisingStack style https://github.com/RisingStack/node-style-guide.
Accounts and Contacts are stored in model folder with the right methods and relevant managers.
StatusMessages class handle HTTP Body responses {json format}.
For authorization purposes, there is a middleware.
There is more, u can check.

### 🔥 Security

Password should be encrypted
In order to secure our password in case of rainbow attack.
I am using "email:password" method with creating sha256 hash 

### 🔥 Testability

For testing purposes, i am using mocha with superagent + should libraries.
You can check test-api file.
```
SERVER_URL='http://localhost:3000' mocha test-api.js 
```

### API structure and usability

API is structured by defining cascading routes which should follow best practice patterns.
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
