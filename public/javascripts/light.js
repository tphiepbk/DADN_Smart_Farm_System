const socket = io('http://localhost:3000/', {
    reconnectionDelayMax: 7000
});

var port = 443;
var host = "io.adafruit.com";
var username = "tphiepbk";
var password = "aio_vjlb21Jsae7D86XwPisWl5WVvud7";

var topic = "tphiepbk/feeds/bk-iot-light-relay";

var messageOn = JSON.stringify({ "id": "11", "name": "RELAY", "data": "1", "unit": "" });
var messageOff = JSON.stringify({ "id": "11", "name": "RELAY", "data": "0", "unit": "" });

var dataUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-light-relay/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7"

var feedsArray = [];
var feedsArrayCreatedAt = [];

var intervalId;

var checkboxAutomatic = document.querySelector('input[type="checkbox"]');

// send a message
function turnOn() {
    console.log('Turn on');
    document.getElementById("textOn").style.display = "block";
    document.getElementById("textOff").style.display = "none";
    client.send(topic, messageOn);
}

function turnOff() {
    console.log('Turn off');
    document.getElementById("textOn").style.display = "none";
    document.getElementById("textOff").style.display = "block";
    client.send(topic, messageOff);
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

console.log("Connecting...");
var client = new Paho.MQTT.Client(host, Number(port), "myclientid_" + parseInt(Math.random() * 100, 10));

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

client.connect({
    password: password,
    userName: username,
    onSuccess: onConnect
});

document.getElementById("textOn").style.display = "none";
document.getElementById("textOff").style.display = "none";
document.getElementById("textCurrentLightValue").style.display = "none";

socket.on('send_data', function(ele1, ele2, ele3, ele4, ele5, ele6, ele7, ele8) {
    var chartDataLight = ele3;
    var chartDataLightRelay = ele7;

    console.log('chart data light:', chartDataLight);
    console.log('chart data light relay:', chartDataLightRelay);

    document.getElementById("textCurrentLightValue").style.display = "block";
    document.getElementById("textCurrentLightValue").innerHTML = chartDataLight[0];

    var currentLightValue = parseInt(chartDataLight[0]);
    var currentLightRelayValue =  parseInt(chartDataLightRelay[0]);

    if (checkboxAutomatic.checked == true) {
        if (currentLightValue >= 100 && currentLightRelayValue == 1) turnOff();
        else if (currentLightValue < 100 && currentLightRelayValue == 0) turnOn();
        else if (currentLightValue < 100 && currentLightRelayValue == 1) turnOn();
        else if (currentLightValue >= 100 && currentLightRelayValue == 0) turnOff();
    }
});