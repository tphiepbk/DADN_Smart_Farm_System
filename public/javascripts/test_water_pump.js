const socket = io('http://localhost:3000/', {
    reconnectionDelayMax: 7000
});

var port = 443;
var host = "io.adafruit.com";
var username = "tphiepbk";
var password = "aio_vjlb21Jsae7D86XwPisWl5WVvud7";

var topic = "tphiepbk/feeds/bk-iot-water-pump-relay";

var messageOn = JSON.stringify({ "id": "11", "name": "RELAY", "data": "1", "unit": "" });
var messageOff = JSON.stringify({ "id": "11", "name": "RELAY", "data": "0", "unit": "" });

var dataUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-water-pump-relay/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7"

var feedsArray = [];
var feedsArrayCreatedAt = [];

var intervalId;

var client;
var table = document.getElementById("recent-feeds-table");

var checkbox = document.querySelector('input[type="checkbox"]');

/*
document.addEventListener('DOMContentLoaded', function () {

    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
            turnOn();
        } else {
            turnOff();
        }
    });
});
*/

// send a message
function turnOn() {
    console.log('Turn on');
    checkbox.checked = true;
    client.send(topic, messageOn);
}

function turnOff() {
    console.log('Turn off');
    checkbox.checked = false;
    client.send(topic, messageOff);
}

function init() {
    console.log("Connecting...");
    client = new Paho.MQTT.Client(host, Number(port), "myclientid_" + parseInt(Math.random() * 100, 10));

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    client.connect({
        password: password,
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

socket.on('send_data', function(ele1, ele2, ele3, ele4, ele5, ele6, ele7, ele8) {
    var chartDataSoil = ele1;
    var chartDataWaterPumpRelay = ele5;

    console.log('chart data soil:', chartDataSoil);
    console.log('chart data water pump relay:', chartDataWaterPumpRelay);

    var currentSoilValue = parseInt(chartDataSoil[0]);
    var currentWaterPumpRelayValue =  parseInt(chartDataWaterPumpRelay[0]);

    if (currentSoilValue >= 100 && currentWaterPumpRelayValue == 1) turnOff();
    else if (currentSoilValue < 100 && currentWaterPumpRelayValue == 0) turnOn();
    else if (currentSoilValue < 100 && currentWaterPumpRelayValue == 1) turnOn();
    else if (currentSoilValue >= 100 && currentWaterPumpRelayValue == 0) turnOff();
});