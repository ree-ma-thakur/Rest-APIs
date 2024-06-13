const express = require("express");
const bodyParser = require("body-parser");

const feedRoutes = require("./routes/feed");

const app = express();

// app.use(bodyParser.urlencoded()); // this is good for form data ;x-www-form-urlencoded
app.use(bodyParser.json()); // to parse json data from incoming requests; application/json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // add header to response; only modilfy it; allowed specific origins
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  ); // allowed origin to access specific methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // allowed to specify specific headers
  next();
});

app.use("/feed", feedRoutes); // routes that start with /feed will be forwarded to these routes

app.listen(8080);
