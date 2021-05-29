var labeldataSoil = [];
var chartdataSoil = [];

var labeldataLight = [];
var chartdataLight = [];

var soil_chart;
var light_chart;

var dataSoilUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-soil/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7"
var dataLightUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-light/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7"

var dataLightRelayUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-light-relay/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7"
var dataWaterPumpRelay = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-water-pump-relay/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7"

var port = 443;
var host = "io.adafruit.com";
var username = "tphiepbk";
var password = "aio_vjlb21Jsae7D86XwPisWl5WVvud7";

var topicLightRelay = "tphiepbk/feeds/bk-iot-light-relay";
var topicWaterPumpRelay = "tphiepbk/feeds/bk-iot-water-pump-relay";

var messageOn = JSON.stringify({ "id": "11", "name": "RELAY", "data": "1", "unit": "" });
var messageOff = JSON.stringify({ "id": "11", "name": "RELAY", "data": "0", "unit": "" });

var stateOfLightRelay = [];
var stateOfWaterPumpRelay = [];

var clientLight;
var clientWaterPump;

function init() {
    console.log("Connecting...");

    clientLight = new Paho.MQTT.Client(host, Number(port), "myclientid_" + parseInt(Math.random() * 100, 10));

    clientWaterPump = new Paho.MQTT.Client(host, Number(port), "myclientid_" + parseInt(Math.random() * 100, 10));

    clientLight.onConnectionLost = onConnectionLost;
    clientLight.onMessageArrived = onMessageArrived;

    clientWaterPump.onConnectionLost = onConnectionLost;
    clientWaterPump.onMessageArrived = onMessageArrived;

    clientLight.connect({
        password: password,
        userName: username,
        onSuccess: onConnectLight
    });

    clientWaterPump.connect({
        password: password,
        userName: username,
        onSuccess: onConnectWaterPump
    });
}

// called when the client connects
function onConnectLight() {
    clientLight.subscribe(topicLightRelay);
    console.log("Connect to Light successfully");
}

function onConnectWaterPump() {
    clientWaterPump.subscribe(topicWaterPumpRelay);
    console.log("Connect to Water Pump successfully");
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

function turnLightOn() {
    clientLight.send(topicLightRelay, messageOn);
}

function turnLightOff() {
    clientLight.send(topicLightRelay, messageOff);
}

function turnWaterPumpOn() {
    clientWaterPump.send(topicWaterPumpRelay, messageOn);
}

function turnWaterPumpOff() {
    clientWaterPump.send(topicWaterPumpRelay, messageOff);
}

function getStateOfLightRelay() {

    var req = new XMLHttpRequest();
    req.responseType = 'json';

    req.open('GET', dataLightRelayUrl, true);
    req.onload  = function() {
        var jsonResponse = req.response;

        stateOfLightRelay = [];

        for (var i = 0 ; i < jsonResponse.length ; i++) {
            stateOfLightRelay.push(parseInt(JSON.parse(jsonResponse[i].value).data));
        }
    };
    req.send();
}

function getStateOfWaterPumpRelay() {

    var req = new XMLHttpRequest();
    req.responseType = 'json';

    req.open('GET', dataWaterPumpRelay, true);
    req.onload  = function() {
        var jsonResponse = req.response;

        stateOfWaterPumpRelay = [];

        for (var i = 0 ; i < jsonResponse.length ; i++) {
            stateOfWaterPumpRelay.push(parseInt(JSON.parse(jsonResponse[i].value).data));
        }
    };
    req.send();
}

function checkRelayAutomatically() {

    getSoilData();
    getLightData();

    getStateOfLightRelay();
    getStateOfWaterPumpRelay();

    if (chartdataLight[0] < 100 && stateOfLightRelay[0] == 0) turnLightOn();
    else if (chartdataLight[0] >= 100 && stateOfLightRelay[0] == 1) turnLightOff();

    if (chartdataSoil[0] < 100 && stateOfWaterPumpRelay[0] == 0) turnWaterPumpOn();
    else if (chartdataSoil[0] >= 100 && stateOfWaterPumpRelay[0] == 1) turnWaterPumpOff();
}

function getSoilData() {

    var req = new XMLHttpRequest();
    req.responseType = 'json';

    req.open('GET', dataSoilUrl, true);
    req.onload  = function() {
        var jsonResponse = req.response;

        labeldataSoil = [];
        chartdataSoil = [];

        for (var i = 0 ; i < jsonResponse.length ; i++) {
            labeldataSoil.push(jsonResponse[i].created_at);
            chartdataSoil.push(parseInt(JSON.parse(jsonResponse[i].value).data));
        }
    };
    req.send();
}

function getLightData() {

    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', dataLightUrl, true);
    req.onload  = function() {

        var jsonResponse = req.response;
        
        labeldataLight = [];
        chartdataLight = [];

        for (var i = 0 ; i < jsonResponse.length ; i++) {
            labeldataLight.push(jsonResponse[i].created_at);
            chartdataLight.push(parseInt(JSON.parse(jsonResponse[i].value).data));
        }
    };
    req.send();
}

function createLightChart() {
    var ctxLight = document.getElementById("light_chart").getContext("2d");

    light_chart = new Chart(ctxLight, {
        type: 'line',
        data: {
            labels: labeldataLight,
            datasets: [{
                label: 'Value',
                data: chartdataLight,
                backgroundColor: "rgb(0,192,255)"
            }]
        }
    });
}

function createSoilChart() {
    var ctxSoil = document.getElementById("soil_chart").getContext("2d");

    soil_chart = new Chart(ctxSoil, {
        type: 'line',
        data: {
            labels: labeldataSoil,
            datasets: [{
                label: 'Value',
                data: chartdataSoil,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ]
            }]
        }
    });
}

function updateChart() {
    console.log('updating chart');

    getLightData();
    getSoilData();

    light_chart.data.labels = labeldataLight;
    light_chart.data.datasets[0].data = chartdataLight;

    soil_chart.data.labels = labeldataSoil;
    soil_chart.data.datasets[0].data = chartdataSoil;

    light_chart.update();
    soil_chart.update();
}

init();

getLightData();
getSoilData();

createLightChart();
createSoilChart();

setInterval(function(){
    // Add two random numbers for each dataset

    checkRelayAutomatically();
    updateChart();

}, 1000);