// client, user and device details

var port        = 443;
var host        = "io.adafruit.com";
var username    = "tphiepbk";
var password    = "aio_vjlb21Jsae7D86XwPisWl5WVvud7";

//var client = new Paho.MQTT.Client(host, Number(port), clientId);

var client;

// send a message
function publish (topic, message) {
    /*
    message = new Paho.MQTT.Message(message);
    message.destinationName = topic;
    message.qos = 2;
    */
    client.send(topic, message);
}

function init() {
    console.log("Connecting...");
    client = new Paho.MQTT.Client(host, Number(port), "myclientid_" + parseInt(Math.random() * 100, 10));
    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    // connect the client
    client.connect({ 
        password : password,
        userName: username,
        onSuccess: onConnect 
    });
}

// called when the client connects
function onConnect() {
    console.log("Connect successfully");
    client.subscribe("tphiepbk/feeds/bk-iot-relay");
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