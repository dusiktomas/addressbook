define({ "api": [
  {
    "type": "post",
    "url": "/api/accounts",
    "title": "create account",
    "name": "CreateAccount",
    "header": {
      "examples": [
        {
          "title": "Request Header:",
          "content": "{\n  \"Content-Type\": \"application/json\"\n}",
          "type": "json"
        }
      ]
    },
    "group": "accounts",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email for auth</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password for auth</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"email\": \"john.newman@gmail.com\",\n  \"password\": \"test\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Was operation successfull</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>Constant for translation purposes</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Response message</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "REQUIRED_FIELDS_MISSING",
            "description": "<p><code>409</code> Email or password is missing..</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EMAIL_IS_NOT_VALID",
            "description": "<p><code>409</code> Email address is not valid.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EMAIL_IS_NOT_AVAILABLE",
            "description": "<p><code>409</code> Email is in use.</p>"
          }
        ],
        "Internal error 500": [
          {
            "group": "Internal error 500",
            "optional": false,
            "field": "INTERNAL_ERROR",
            "description": "<p><code>500</code> Something is wrong, please try this operation later.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "temp/server.js",
    "groupTitle": "accounts"
  },
  {
    "type": "post",
    "url": "/api/accounts/login",
    "title": "login account",
    "name": "LoginAccount",
    "header": {
      "examples": [
        {
          "title": "Request Header:",
          "content": "{\n  \"Content-Type\": \"application/json\"\n}",
          "type": "json"
        }
      ]
    },
    "group": "accounts",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email for auth</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password for auth</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"email\": \"john.newman@gmail.com\",\n  \"password\": \"test\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Was operation successfull</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>Constant for translation purposes</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Response message</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "authToken",
            "description": "<p>Auth token for authentication to the server</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "account",
            "description": "<p>Acciybt information</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "REQUIRED_FIELDS_MISSING",
            "description": "<p><code>409</code> Email or password is missing..</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EMAIL_IS_NOT_VALID",
            "description": "<p><code>409</code> Email address is not valid.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "USER_DOES_NOT_EXISTS",
            "description": "<p><code>409</code> User with this credentials not exists.</p>"
          }
        ],
        "Internal error 500": [
          {
            "group": "Internal error 500",
            "optional": false,
            "field": "INTERNAL_ERROR",
            "description": "<p><code>500</code> Something is wrong, please try this operation later.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "temp/server.js",
    "groupTitle": "accounts"
  },
  {
    "type": "post",
    "url": "/api/contacts",
    "title": "create contact for account",
    "name": "CreateContact",
    "header": {
      "examples": [
        {
          "title": "request header:",
          "content": "{\n  \"content-type\": \"application/json\",\n  \"x-auth-token\": \"authorization key \"\n}",
          "type": "json"
        }
      ]
    },
    "group": "contacts",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "fullName",
            "description": "<p>Name and surname of contact</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of contact</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone",
            "description": "<p>Phone number of contact</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"fullName\": \"John Newman\",\n  \"email\": \"john.newman@gmail.com\",\n  \"phone\": \"775 542 556\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Was operation successfull</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>Constant for translation purposes</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Response message</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "contact",
            "description": "<p>Contact information</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INVALID_CONTACT",
            "description": "<p><code>409</code> Contact has invalid format, check email format and others...</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NO_AUTH_TOKEN",
            "description": "<p><code>403</code> Auth token is missing in headers or in json.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTH_ERROR",
            "description": "<p><code>403</code> Bad auth token.</p>"
          }
        ],
        "Internal error 500": [
          {
            "group": "Internal error 500",
            "optional": false,
            "field": "INTERNAL_ERROR",
            "description": "<p><code>500</code> Something is wrong, please try this operation later.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "temp/server.js",
    "groupTitle": "contacts"
  }
] });
