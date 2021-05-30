const express = require("express");
const path = require("path");
//require("./db/conn");
//require("./db/get_data");
require("./db/get_data_test");

const app = express();
const port = process.env.PORT || 3000;

const staticpath = path.join(__dirname, "./public");
const templatepath = path.join(__dirname, "./views");
const imagepath = path.join(__dirname, "./public/images");
const scriptpath = path.join(__dirname, "./public/javascripts");

// Middleware
app.use(express.static(staticpath));
app.use(express.static(imagepath));
app.use(express.static(scriptpath));

app.set("view engine", "ejs");
app.set("views", templatepath);

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

app.listen(port, () =>{
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