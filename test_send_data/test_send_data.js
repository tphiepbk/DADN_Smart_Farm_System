var port        = 443;
var host        = "io.adafruit.com";
var username    = "tphiepbk";
var password    = "aio_bSDL29hJEUFdmxkrj3OpHsNLJqxZ";

var topicSoil = "tphiepbk/feeds/bk-iot-soil";
var topicLight = "tphiepbk/feeds/bk-iot-light";

var client;

// send a message
function publishSoilData () {

    var value = parseInt(document.getElementById('soil_value').value);
    console.log(value);

    if (value < 0) value = 0;
    if (value > 1023) value = 1023;

    var message = JSON.stringify({"id" : "9", "name": "SOIL", "data" : value.toString() , "unit" : ""});
    client.send(topicSoil, message);
}

function publishLightData () {

    var value = parseInt(document.getElementById('light_value').value);
    console.log(value);

    if (value < 0) value = 0;
    if (value > 1023) value = 1023;

    var message = JSON.stringify({"id" : "13", "name": "LIGHT", "data" : value.toString() , "unit" : ""});
    client.send(topicLight, message);
}

function init() {
    console.log("Connecting...");
    client = new Paho.MQTT.Client(host, Number(port), "myclientid_" + parseInt(Math.random() * 100, 10));

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    client.connect({ 
        password : password,
        userName: username,
        onSuccess: onConnect 
    });
}

// called when the client connects
function onConnect() {
    client.subscribe(topicSoil);
    client.subscribe(topicLight);
    console.log("Connect successfully");
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

// called when a message arrives
function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
}

init();