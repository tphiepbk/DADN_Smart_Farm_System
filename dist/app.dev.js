"use strict";

var express = require("express");

var path = require("path");

var bodyParser = require('body-parser');

var mongoose = require("mongoose");

var MongoClient = require('mongodb').MongoClient;

var expressLayouts = require('express-ejs-layouts');

var passport = require('passport');

var flash = require('connect-flash');

var session = require('express-session');

var assert = require('assert');

var User = require("./models/User"); // Connection URL


var connectionString = "mongodb+srv://fwbteam:fwbteam@cluster0.in5dd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"; //require("./db/conn");
//require("./db/get_data");

require("./db/get_data_test"); // Passport Config


require('./config/passport')(passport); // DB Config


mongoose.connect("mongodb+srv://Banvoiloiich:123@cluster0.b4qy2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(function () {
  console.log("connected to mongodb cloud! :)");
})["catch"](function (err) {
  console.log(err);
});
var app = express();
var port = process.env.PORT || 3000;

var server = require("http").createServer(app);

var io = require("socket.io")(server);

var staticpath = path.join(__dirname, "./public");
var templatepath = path.join(__dirname, "./views");
var imagepath = path.join(__dirname, "./public/images");
var scriptpath = path.join(__dirname, "./public/javascripts"); // Middleware

app.use(express["static"]('public'));
app.use(express["static"](staticpath));
app.use(express["static"](imagepath));
app.use(express["static"](scriptpath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.set("views", templatepath); // Express body parser

app.use(express.urlencoded({
  extended: true
})); // Express session

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
})); // Passport middleware

app.use(passport.initialize());
app.use(passport.session()); // Connect flash

app.use(flash()); // Global variables

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
}); // Routes
// Routes

app.use('/', require('./routes/index.js'));
app.use('/', require('./routes/users.js')); // const index_router = require('./routes/index');
// const notification_router = require('./routes/notification');
// const light_system_statistic = require('./routes/light_system_statistic');
// const light_router = require('./routes/light');
// const water_pump_system_statistic_router = require('./routes/water_pump_system_statistic');
// const water_pump_router = require('./routes/water_pump');
// const database_router = require('./routes/database');
// const login_router = require('./routes/login');
// app.use('/', index_router);
// app.use('/notification', notification_router);
// app.use('/light', light_router);
// app.use('/light_system_statistic', light_system_statistic);
// app.use('/water_pump_system_statistic', water_pump_system_statistic_router);
// app.use('/water_pump', water_pump_router);
// app.use('/database', database_router);
// app.use('/login', login_router);

/*
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/notification", (req, res) => {
    res.render("notification");
});

app.get("/light_system_statistic", (req, res) => {
    res.render("light_system_statistic");
});

app.get("/water_pump_system_statistic", (req, res) => {
    res.render("water_pump_system_statistic");
});

app.get("/database", (req, res) => {
    res.render("database");
});

app.get("/light", (req, res) => {
    res.render("light");
});

app.get("/water_pump", (req, res) => {
    res.render("water_pump");
});
*/

/*
app.listen(port, () =>{
    console.log('Server is running at port ' + port);
});
*/

server.listen(port, function () {
  console.log('Server is running at port ' + port);
}); // Get data from mongoDB

var chartSoilData = [];
var labelSoilData = [];
var chartLightData = [];
var labelLightData = [];
var chartLightRelayData = [];
var labelLightRelayData = [];
var chartWaterPumpRelayData = [];
var labelWaterPumpRelayData = [];

function getLightRelayData() {
  MongoClient.connect(connectionString, function (err, client) {
    var temp1 = [];
    var temp2 = [];
    assert.equal(null, err);
    var db = client.db("bk-iot");
    var cursor = db.collection('bk-iot-light-relay').find().sort({
      "created_at": -1
    });
    cursor.forEach(function (doc, err) {
      assert.equal(null, err); //console.log(doc.value);

      temp1.push(JSON.parse(doc.value).data);
      temp2.push(doc.created_at);
    }, function () {
      client.close();
      chartLightRelayData = temp1;
      labelLightRelayData = temp2;
    });
  });
  /*
  console.log(chartLightRelayData);
  console.log(labelLightRelayData);
  */
}

function getWaterPumpRelayData() {
  MongoClient.connect(connectionString, function (err, client) {
    var temp1 = [];
    var temp2 = [];
    assert.equal(null, err);
    var db = client.db("bk-iot");
    var cursor = db.collection('bk-iot-water-pump-relay').find().sort({
      "created_at": -1
    });
    cursor.forEach(function (doc, err) {
      assert.equal(null, err); //console.log(doc.value);

      temp1.push(JSON.parse(doc.value).data);
      temp2.push(doc.created_at);
    }, function () {
      client.close();
      chartWaterPumpRelayData = temp1;
      labelWaterPumpRelayData = temp2;
    });
  });
  /*
  console.log(chartWaterPumpRelayData);
  console.log(labelWaterPumpRelayData);
  */
}

function getSoilData() {
  MongoClient.connect(connectionString, function (err, client) {
    var temp1 = [];
    var temp2 = [];
    assert.equal(null, err);
    var db = client.db("bk-iot");
    var cursor = db.collection('bk-iot-soil').find().sort({
      "created_at": -1
    });
    cursor.forEach(function (doc, err) {
      assert.equal(null, err); //console.log(doc.value);

      temp2.push(doc.created_at);
      temp1.push(JSON.parse(doc.value).data);
    }, function () {
      client.close();
      /*
      console.log(chartSoilData);
      console.log(labelSoilData);
      */

      chartSoilData = temp1;
      labelSoilData = temp2;
    });
  });
  /*
  console.log(chartSoilData);
  console.log(labelSoilData);
  */
}

function getLightData() {
  MongoClient.connect(connectionString, function (err, client) {
    var temp1 = [];
    var temp2 = [];
    assert.equal(null, err);
    var db = client.db("bk-iot");
    var cursor = db.collection('bk-iot-light').find().sort({
      "created_at": -1
    });
    cursor.forEach(function (doc, err) {
      assert.equal(null, err); //console.log(doc.value);

      temp2.push(doc.created_at);
      temp1.push(JSON.parse(doc.value).data);
    }, function () {
      client.close();
      chartLightData = temp1;
      labelLightData = temp2;
    });
  });
  /*
  console.log(chartLightData);
  console.log(labelLightData);
  */
}

io.on('connection', function (socket) {
  console.log('Connected to socket.io successfully');
  setInterval(function () {
    getSoilData();
    getLightData();
    getLightRelayData();
    getWaterPumpRelayData();
    console.log('emitting');
    socket.emit('send_data', chartSoilData, labelSoilData, chartLightData, labelLightData, chartWaterPumpRelayData, labelWaterPumpRelayData, chartLightRelayData, labelLightRelayData);
  }, 5000);
}); // ! Prevent app crash

process.on('uncaughtException', function (error, origin) {
  console.log('----- Uncaught exception -----');
  console.log(error);
  console.log('----- Exception origin -----');
  console.log(origin);
});
process.on('unhandledRejection', function (reason, promise) {
  console.log('----- Unhandled Rejection at -----');
  console.log(promise);
  console.log('----- Reason -----');
  console.log(reason);
});