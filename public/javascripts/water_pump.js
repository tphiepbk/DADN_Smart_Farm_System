const socket = io('http://localhost:3000/', {
    reconnectionDelayMax: 7000
});

var port        = 443;
var host        = "io.adafruit.com";
var username    = "tphiepbk";
var password    = "aio_vjlb21Jsae7D86XwPisWl5WVvud7";

var topic = "tphiepbk/feeds/bk-iot-water-pump-relay";

var messageOn = JSON.stringify({"id" : "11", "name": "RELAY", "data" : "1" , "unit" : ""});
var messageOff = JSON.stringify({"id" : "11", "name": "RELAY", "data" : "0" , "unit" : ""});

var dataUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-water-pump-relay/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7"

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
    password : password,
    userName: username,
    onSuccess: onConnect 
});

document.getElementById("textOn").style.display = "none";
document.getElementById("textOff").style.display = "none";
document.getElementById("textCurrentSoilValue").style.display = "none";

// * For light chart
var ctxWaterPump = document.getElementById("water_pump_chart").getContext("2d");

var water_pump_chart = new Chart(ctxWaterPump, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'On',
            data: [],
            backgroundColor: [
                'rgb(60, 179, 113)'
            ],
            borderColor: [
                'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        },
        {
            label: 'Off',
            data: [],
            backgroundColor: [
                'rgb(255, 0, 0)'
            ],
            borderColor: [
                'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }
        ]
    }
});

socket.on('send_data', function(ele1, ele2, ele3, ele4, ele5, ele6, ele7, ele8) {
    var chartDataSoil = ele1;
    var chartDataWaterPumpRelay = ele5;
    var labelDataWaterPumpRelay = ele6;

    console.log('chart data soil:', chartDataSoil);
    console.log('chart data water pump relay:', chartDataWaterPumpRelay);
    console.log('label data water pump relay:', labelDataWaterPumpRelay);

    document.getElementById("textCurrentSoilValue").style.display = "block";
    document.getElementById("textCurrentSoilValue").innerHTML = chartDataSoil[0];

    var labelDataWaterPumpRelayDate = [];
    var numberOfWaterPumpOn = [];
    var numberOfWaterPumpOff = [];

    var currentNumberWaterPumpOn = 0;
    var currentNumberWaterPumpOff = 0;

    for (var i = 0 ; i < labelDataWaterPumpRelay.length ; i++) {
        var currentDate = labelDataWaterPumpRelay[i].substr(0, 10);
        var currentStateOfSwitch = parseInt(chartDataWaterPumpRelay[i]);

        if (currentDate != labelDataWaterPumpRelayDate[labelDataWaterPumpRelayDate.length - 1] && labelDataWaterPumpRelayDate.length != 0) {
            numberOfWaterPumpOn.push(currentNumberWaterPumpOn);
            numberOfWaterPumpOff.push(currentNumberWaterPumpOff);
            currentNumberWaterPumpOff = 0;
            currentNumberWaterPumpOn = 0;
        }

        if (currentStateOfSwitch == 1) {
            currentNumberWaterPumpOn++;
        }
        else {
            currentNumberWaterPumpOff++;
        }

        if (labelDataWaterPumpRelayDate.length == 0 || labelDataWaterPumpRelayDate[labelDataWaterPumpRelayDate.length-1] !== currentDate) {
            labelDataWaterPumpRelayDate.push(currentDate);
        }
    }

    console.log(labelDataWaterPumpRelayDate);
    console.log(numberOfWaterPumpOn);
    console.log(numberOfWaterPumpOff);

    water_pump_chart.data.labels = labelDataWaterPumpRelayDate;
    water_pump_chart.data.datasets[0].data = numberOfWaterPumpOn;
    water_pump_chart.data.datasets[1].data = numberOfWaterPumpOff;

    water_pump_chart.update();

    var currentSoilValue = parseInt(chartDataSoil[0]);
    var currentWaterPumpRelayValue =  parseInt(chartDataWaterPumpRelay[0]);

    if (currentWaterPumpRelayValue == 0) {
        document.getElementById("textOn").style.display = "none";
        document.getElementById("textOff").style.display = "block";
    }
    else {
        document.getElementById("textOn").style.display = "block";
        document.getElementById("textOff").style.display = "none";
    }

    if (checkboxAutomatic.checked == true) {
        if (currentSoilValue >= 100 && currentWaterPumpRelayValue == 1) turnOff();
        else if (currentSoilValue < 100 && currentWaterPumpRelayValue == 0) turnOn();
    }
});