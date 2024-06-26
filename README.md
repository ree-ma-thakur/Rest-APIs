# Basics

- Not every frontend (UI) requires HTML pages like mobile apps(React Native, Android, iOS), these UI are build totally decoupled from the server, they don't need any HTML code
- Other examples that doesn't need HTML pages are Single Page Web Apps(React etc), Service APIs(eg: Google Maps APIs)
- Doesn't need HTML code, just need backend that needs to serve the data : this is code idea for building Rest APIs because here we need different kind of responses (not HTML views)
- ![Rest APIs](images/image.png)
- REST: Representational state transfer; i.e transfer data instead of User Interfaces
- Only the response & request data changes, NOT the general server side logic
- ![Rest APIs big pic](images/image-1.png)
- We can exhcange data in many formats
- ![Data formats](images/image-2.png)
- ![Routing](images/image-3.png)
- ![Http methods](images/image-4.png)
- ![Rest Principles](images/image-5.png)

# Project setup

- npm init
- npm i --save express
- npm i --save-dev nodemon
- "start": "nodemon app.js" : Add this to scripts in package.json
- npm i --save body-parser (to parse incoming requests)

# Implementation

- Return json response from controllers
- Test APIs using Postman

# CORS

- Cross Origin Resource Sharing
- By default it is not allowed by browsers
- ![CORS](images/image-6.png)
- To solve this CORS error, we need to set some special headers
- ![Summary](images/image-7.png)

# More Implementation

- ![Node vs rest apis](images/image-8.png)
- getPosts API
- createPost API
- npm i --save express-validator
- npm i --save mongoose
- To add created & updated at automatically in mongoose schema we can add timestamps:true constructor
- To statically serve images, add middleware in app.js
- to parse uploaded files : npm i --save multer
- add it to app.js
- To store the password we should hash it
- npm i --save bcryptjs

# Authentication

- RestAPIs are stateless therefore no session as RestAPIs doesn't care about client; strict decoupling of server & client & every request should be treated standalone
- Server will not store anything about client
- After checking the validity of email, password combination then will return token to the client generated on server
- Token will then be stored in client, then client will attach this token with every subsequent request it sends to server
- Token can only be validated by the server
- ![Auth flow](images/image-9.png)
- ![Auth JWT token](images/image-10.png)

# JWT Token

- After comapring password during login we need to generate JWT token
- npm i --save jsonwebtoken
- ![Summary](images/image-11.png)

# Async await

- Instead of then catch we can use async await inside try catch blocks
- Top level await: we can use await without async, at top level (not inside function but outside the function, inside fun we have to use async fun & then await Promises)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

# Sockets

- https://socket.io/get-started/chat/
- https://www.npmjs.com/package/express-ws
