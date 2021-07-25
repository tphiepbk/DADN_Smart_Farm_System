const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const assert = require('assert');
const fetch = require("node-fetch");

const User = require("./models/User");
const { compareSync } = require("bcryptjs");

// * Automatically get data from URL to MongoDB
const dataLoader = require("./db/get_data");

// Passport Config
require('./config/passport')(passport);

// DB Config
mongoose.connect("mongodb+srv://Banvoiloiich:123@cluster0.b4qy2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
})
.then(() => {
    console.log("Connected to mongodb cloud (credential database) !");
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

var cors = require('cors')
app.use(cors())

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
app.use('/', require('./routes/index.js'));
app.use('/', require('./routes/users.js'));

/*
setInterval(() => {
    dataLoader.fullLoader();
}, 1000);
*/

const MongoClient = require('mongodb').MongoClient;
const connectionString = "mongodb+srv://fwbteam:fwbteam@cluster0.in5dd.mongodb.net/bk-iot?retryWrites=true&w=majority";

function iterateFunc(doc) {
    console.log(JSON.stringify(doc, null, 4));
};

function errorFunc(error) {
    console.log(error);
};

io.on("connection", socket => {

    console.log("Connected to SocketIO successfully");
    var element = "hello world";

    setInterval(() => {

        dataLoader.fullLoader();

        MongoClient.connect(connectionString, async function(err, client) {
            const db = client.db("bk-iot");

            var chartDataLightRelay = [];
            var labelDataLightRelay = [];
            var collection_light_relay = db.collection('bk-iot-light-relay');
            const cursor_light_relay = collection_light_relay.find({}).sort({created_at : -1});
            const allValues_light_relay = await cursor_light_relay.toArray(); 
            for (var element of allValues_light_relay) {
                labelDataLightRelay.push(element.created_at);
                chartDataLightRelay.push(JSON.parse(element.value).data);
            }

            var chartDataWaterPumpRelay = [];
            var labelDataWaterPumpRelay = [];
            var collection_water_pump_relay = db.collection('bk-iot-water-pump-relay');
            const cursor_water_pump_relay = collection_water_pump_relay.find({}).sort({created_at : -1});
            const allValues_water_pump_relay = await cursor_water_pump_relay.toArray(); 
            for (var element of allValues_water_pump_relay) {
                labelDataWaterPumpRelay.push(element.created_at);
                chartDataWaterPumpRelay.push(JSON.parse(element.value).data);
            }

            var chartDataLight = [];
            var labelDataLight = [];
            var collection_light = db.collection('bk-iot-light');
            const cursor_light = collection_light.find({}).sort({created_at : -1});
            const allValues_light = await cursor_light.toArray(); 
            for (var element of allValues_light) {
                labelDataLight.push(element.created_at);
                chartDataLight.push(JSON.parse(element.value).data);
            }

            var chartDataSoil = [];
            var labelDataSoil = [];
            var collection_soil = db.collection('bk-iot-soil');
            const cursor_soil = collection_soil.find({}).sort({created_at : -1});
            const allValues_soil = await cursor_soil.toArray(); 
            for (var element of allValues_soil) {
                labelDataSoil.push(element.created_at);
                chartDataSoil.push(JSON.parse(element.value).data);
            }

            socket.emit("send_data", chartDataLight, labelDataLight, chartDataSoil, labelDataSoil, chartDataLightRelay, labelDataLightRelay, chartDataWaterPumpRelay, labelDataWaterPumpRelay);

            client.close();
        });

    }, 3000);
});

server.listen(port, () =>{
    console.log('Server is running at port ' + port);
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
