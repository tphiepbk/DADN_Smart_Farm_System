const socket = io('http://localhost:3000/', {
    reconnectionDelayMax: 7000
});

var labeldataSoil = [];
var chartdataSoil = [];

var labeldataLight = [];
var chartdataLight = [];

var port = 443;
var host = "io.adafruit.com";
var username = "tphiepbk";
var password = "aio_vjlb21Jsae7D86XwPisWl5WVvud7";

var topicLightRelay = "tphiepbk/feeds/bk-iot-light-relay";
var topicWaterPumpRelay = "tphiepbk/feeds/bk-iot-water-pump-relay";

var clientLight;
var clientWaterPump;

/*
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

init();
*/

var ctxSoil = document.getElementById("soil_chart").getContext("2d");
var soil_chart = new Chart(ctxSoil, {
    type: 'line',
    data: {
        labels: labeldataSoil,
        datasets: [{
            label: 'Soil',
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

var ctxLight = document.getElementById("light_chart").getContext("2d");
var light_chart = new Chart(ctxLight, {
    type: 'line',
    data: {
        labels: labeldataLight,
        datasets: [{
            label: 'Light',
            data: chartdataLight,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(106, 90, 205, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ]
        }]
    }
});

socket.on('send_data', function(ele1, ele2, ele3, ele4, ele5, ele6, ele7, ele8) {
    chartdataSoil = ele1;
    labeldataSoil = ele2;
    chartdataLight  = ele3;
    labeldataLight = ele4;

    console.log('chart data soil:', chartdataSoil);
    console.log('label data soil:', labeldataSoil);
    console.log('chart data light:', chartdataLight);
    console.log('label data light:', labeldataLight);

    light_chart.data.labels = labeldataLight;
    light_chart.data.datasets[0].data = chartdataLight;
    light_chart.update();

    soil_chart.data.labels = labeldataSoil;
    soil_chart.data.datasets[0].data = chartdataSoil;
    soil_chart.update();
});

lowLightAlertHide();
highLightAlertHide();
lowSoilAlertHide();
highSoilAlertHide();