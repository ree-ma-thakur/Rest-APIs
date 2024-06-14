const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const MONGODB_URI =
  "mongodb+srv://reemathakur0214:Noderoot%40123@cluster0.n4dgexg.mongodb.net/messages?retryWrites=true&w=majority&appName=Cluster0";

const feedRoutes = require("./routes/feed");

const app = express();

// app.use(bodyParser.urlencoded()); // this is good for form data ;x-www-form-urlencoded
app.use(bodyParser.json()); // to parse json data from incoming requests; application/json
app.use("/images", express.static(path.join(__dirname, "images"))); // to statically serve the images path

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

// error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log("Connected to DB");
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
