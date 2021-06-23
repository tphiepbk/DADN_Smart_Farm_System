const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient;
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const assert = require('assert');
const fetch = require("node-fetch");

const User = require("./models/User");
const { compareSync } = require("bcryptjs");

// Connection URL
//const connectionString = "mongodb+srv://tphiepbk:hiepit-2992@cluster0.axbkf.mongodb.net/bk-iot-test?retryWrites=true&w=majority";
const connectionString = "mongodb+srv://fwbteam:fwbteam@cluster0.in5dd.mongodb.net/bk-iot?retryWrites=true&w=majority";

//require("./db/conn");
//require("./db/get_data");
require("./db/get_data_test");

// Passport Config
require('./config/passport')(passport);

// DB Config
mongoose
  .connect("mongodb+srv://Banvoiloiich:123@cluster0.b4qy2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("connected to mongodb cloud! :)");
  })
  .catch((err) => {
    console.log(err);
  });


const app = express();
const port = process.env.PORT || 3000;

const server = require("http").createServer(app);
const io = require("socket.io")(server);

const staticpath = path.join(__dirname, "./public");
const templatepath = path.join(__dirname, "./views");
const imagepath = path.join(__dirname, "./public/images");
const scriptpath = path.join(__dirname, "./public/javascripts");

// Middleware
app.use(express.static('public'));
app.use(express.static(staticpath));
app.use(express.static(imagepath));
app.use(express.static(scriptpath));
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true})); 

app.set("view engine", "ejs");
app.set("views", templatepath);

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);



// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
// Routes
app.use('/', require('./routes/index.js'));
app.use('/', require('./routes/users.js'));
// const index_router = require('./routes/index');
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

server.listen(port, () =>{
    console.log('Server is running at port ' + port);
});

// Get data from mongoDB
var chartSoilData = [];
var labelSoilData = [];

var prev_chartSoilData = [];
var prev_labelSoilData = [];

var chartLightData = [];
var labelLightData = [];

var prev_chartLightData = [];
var prev_labelLightData = [];

var chartLightRelayData = [];
var labelLightRelayData = [];

var prev_chartLightRelayData = [];
var prev_labelLightRelayData = [];

var chartWaterPumpRelayData = [];
var labelWaterPumpRelayData = [];

var prev_chartWaterPumpRelayData = [];
var prev_labelWaterPumpRelayData = [];

const light_relay_url = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-light-relay/data.json?X-AIO-Key=aio_cYBc43npiEvVpGtSYhA5fQ3r0PSp"
const light_url = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-light/data.json?X-AIO-Key=aio_cYBc43npiEvVpGtSYhA5fQ3r0PSp"
const soil_url = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-soil/data.json?X-AIO-Key=aio_cYBc43npiEvVpGtSYhA5fQ3r0PSp"
const water_pump_relay_url = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-water-pump-relay/data.json?X-AIO-Key=aio_cYBc43npiEvVpGtSYhA5fQ3r0PSp"

function updateData(input_chartLightData, input_labelLightData) {
    chartLightData = input_chartLightData;
    labelLightData = input_labelLightData;
}

function getAllData(lightUrl, soilUrl, lightRelayUrl, waterPumpRelayUrl) {
    fetch(lightUrl)
    .then(data=>{return data.json()})
    .then(res=>{
        for (var i = 0 ; i < res.length ; i++) {
            temp3.push(JSON.parse(res[i].value).data);
            temp4.push(res[i].created_at);
        }
        /*
        console.log(temp3);
        console.log(temp4);
        */
        updateData(temp3, temp4);
    });
};

function getData(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
        .then(response => {
            return response.json();
        }).then(data_from_fetched => {
            var temp1 = [], temp2 = [];
            for (var i = 0 ; i < data_from_fetched.length ; i++) {
                temp1.push(JSON.parse(data_from_fetched[i].value).data);
                temp2.push(data_from_fetched[i].created_at);
            }
            resolve([temp1, temp2]);
        })
    })
}

/*
var arr = [];
getData(light_url).then(data => {
    arr = data[0];
});
console.log(arr);
*/
console.log(getData(light_url));

/*
getAllData(light_url, soil_url, light_relay_url, water_pump_relay_url);

console.log(chartLightData);
console.log(labelLightData);
*/

function getLightRelayData() {

    MongoClient.connect(connectionString, function(err, client) {

        var temp1 = [];
        var temp2 = [];

        assert.equal(null, err);

        const db = client.db("bk-iot");

        var cursor = db.collection('bk-iot-light-relay').find().sort({"created_at":-1});

        cursor.forEach(function(doc, err) {
            assert.equal(null, err);

            //console.log(doc.value);

            temp1.push(JSON.parse(doc.value).data);
            temp2.push(doc.created_at);

        }, function() {
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

    MongoClient.connect(connectionString, function(err, client) {

        var temp1 = [];
        var temp2 = [];

        assert.equal(null, err);

        const db = client.db("bk-iot");

        var cursor = db.collection('bk-iot-water-pump-relay').find().sort({"created_at":-1});

        cursor.forEach(function(doc, err) {
            assert.equal(null, err);

            //console.log(doc.value);

            temp1.push(JSON.parse(doc.value).data);
            temp2.push(doc.created_at);

        }, function() {
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

    MongoClient.connect(connectionString, function(err, client) {

        var temp1 = [];
        var temp2 = [];

        assert.equal(null, err);

        const db = client.db("bk-iot");

        var cursor = db.collection('bk-iot-soil').find().sort({"created_at":-1});

        cursor.forEach(function(doc, err) {
            assert.equal(null, err);

            //console.log(doc.value);

            temp2.push(doc.created_at);
            temp1.push(JSON.parse(doc.value).data);

        }, function() {
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

    MongoClient.connect(connectionString, function(err, client) {

        var temp1 = [];
        var temp2 = [];

        assert.equal(null, err);

        const db = client.db("bk-iot");

        var cursor = db.collection('bk-iot-light').find().sort({"created_at":-1});

        cursor.forEach(function(doc, err) {
            assert.equal(null, err);

            //console.log(doc.value);

            temp2.push(doc.created_at);
            temp1.push(JSON.parse(doc.value).data);

        }, function() {
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

/*
getSoilData();
getLightData();
getLightRelayData();
getWaterPumpRelayData();
*/

io.on('connection', socket => {
    console.log('Connected to socket.io successfully');
    

    /*
    setInterval(function() {

        getSoilData();
        getLightData();
        getLightRelayData();
        getWaterPumpRelayData();

        console.log('emitting');

        socket.emit('send_data', chartSoilData, labelSoilData, chartLightData, labelLightData, chartWaterPumpRelayData, labelWaterPumpRelayData, chartLightRelayData, labelLightRelayData);

    }, 7000);
    */

    /*
    if (prev_chartLightData.length != chartLightData.length || prev_chartSoilData.length != chartSoilData.length || prev_chartLightRelayData != chartLightRelayData || prev_chartWaterPumpRelayData != chartWaterPumpRelayData) {
        prev_chartLightData = chartLightData;
        prev_chartSoilData = chartSoilData;
        prev_chartLightRelayData = chartLightRelayData;
        prev_chartWaterPumpRelayData = chartWaterPumpRelayData;
    }

    setTimeout(() => {
        console.log('emitting first time');
        socket.emit('send_data_first_time', chartSoilData, labelSoilData, chartLightData, labelLightData, chartWaterPumpRelayData, labelWaterPumpRelayData, chartLightRelayData, labelLightRelayData);
    }, 3000);

    socket.on('return', function(element) {
        getSoilData();
        getLightData();
        getLightRelayData();
        getWaterPumpRelayData();

        console.log('emitting');
        socket.emit('send_data', chartSoilData, labelSoilData, chartLightData, labelLightData, chartWaterPumpRelayData, labelWaterPumpRelayData, chartLightRelayData, labelLightRelayData);
    });
    */
});


// ! Prevent app crash
process.on('uncaughtException', (error, origin) => {
    console.log('----- Uncaught exception -----')
    console.log(error)
    console.log('----- Exception origin -----')
    console.log(origin)
})

process.on('unhandledRejection', (reason, promise) => {
    console.log('----- Unhandled Rejection at -----')
    console.log(promise)
    console.log('----- Reason -----')
    console.log(reason)
})
