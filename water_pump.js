// client, user and device details

var port        = 443;
var host        = "io.adafruit.com";
var username    = "tphiepbk";
var password    = "aio_vjlb21Jsae7D86XwPisWl5WVvud7";

var topic = "tphiepbk/feeds/bk-iot-water-pump-relay";

var messageOn = JSON.stringify({"id" : 11, "name": "RELAY", "data" : 1 , "unit" : ""});
var messageOff = JSON.stringify({"id" : 11, "name": "RELAY", "data" : 0 , "unit" : ""});

var client;

// send a message
function turnOn () {
    /*
    message = new Paho.MQTT.Message(message);
    message.destinationName = topic;
    message.qos = 2;
    */
    client.send(topic, messageOn);
}

function turnOff () {
    /*
    message = new Paho.MQTT.Message(message);
    message.destinationName = topic;
    message.qos = 2;
    */
    client.send(topic, messageOff);
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
    client.subscribe(topic);
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