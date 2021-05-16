// client, user and device details

var port        = 443;
var host        = "io.adafruit.com";
var username    = "tphiepbk";
var password    = "aio_vjlb21Jsae7D86XwPisWl5WVvud7";

/*
var port        = 1883;
var host        = "13.76.250.158";
var username    = "BKvm2";
var password    = "Hcmut_CSE_2020";
*/

// configure the client to Cumulocity
//var client = new Paho.MQTT.Client(host, Number(port), clientId);

var client;

// send a message
function publish (topic, message) {
    message = new Paho.MQTT.Message(message);
    message.destinationName = topic;
    message.qos = 2;
    client.send(message);
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
    // Once a connection has been made, make a subscription and send a message.
    console.log("Connect successfully");
    client.subscribe("tphiepbk/feeds/dadn-light");
    client.subscribe("tphiepbk/feeds/dadn-water-pump");
    /*
    client.subscribe("NPNLab_BBC/feeds/bk-iot-soil");
    client.subscribe("NPNLab_BBC/feeds/bk-iot-light");
    */
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

/*
$.getJSON('https://io.adafruit.com/api/v2/tphiepbk/feeds/dadn-moisture/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7', function(data) {
    console.log(data);
});

$.getJSON('https://io.adafruit.com/api/v2/tphiepbk/feeds/dadn-light/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7', function(data) {
    console.log(data);
});
*/