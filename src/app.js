const express = require("express");
const path = require("path");
require("./db/conn");

const app = express();
const port = process.env.PORT || 3000;

const staticpath = path.join(__dirname, "../public");
const templatepath = path.join(__dirname, "../views");
const imagepath = path.join(__dirname, "../public/images");

// Middleware
app.use(express.static(staticpath));
app.use(express.static(imagepath));

app.set("view engine", "ejs");
app.set("views", templatepath);

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/light_system_statistic", (req, res) => {
    res.render("light_system_statistic");
})

app.get("/water_pump_system_statistic", (req, res) => {
    res.render("water_pump_system_statistic");
})

app.get("/notification", (req, res) => {
    res.render("notification");
})

app.get("/database", (req, res) => {
    res.render("database");
})

app.get("/light", (req, res) => {
    res.render("light");
})

app.get("/water_pump", (req, res) => {
    res.render("water_pump");
})

app.listen(port, () =>{
    console.log('Server is running at port ' + port);
});