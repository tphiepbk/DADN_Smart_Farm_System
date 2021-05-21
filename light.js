var port        = 443;
var host        = "io.adafruit.com";
var username    = "tphiepbk";
var password    = "aio_vjlb21Jsae7D86XwPisWl5WVvud7";

var topic = "tphiepbk/feeds/bk-iot-light-relay";

var messageOn = JSON.stringify({"id" : 11, "name": "RELAY", "data" : 1 , "unit" : ""});
var messageOff = JSON.stringify({"id" : 11, "name": "RELAY", "data" : 0 , "unit" : ""});

var dataUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-light-relay/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7"

var client;

// send a message
function turnOn () {
    client.send(topic, messageOn);
}

function turnOff () {
    client.send(topic, messageOff);
}

function getData() {
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', dataUrl, true);
    req.onload  = function() {
        var jsonResponse = req.response;
        console.log(jsonResponse.length);
        console.log(JSON.parse(jsonResponse[0].value).data);
    };
    req.send();
}

var intervalId = window.setInterval(function(){
    getData();
}, 5000);

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