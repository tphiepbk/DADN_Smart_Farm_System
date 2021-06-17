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

var relayUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-water-pump-relay/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7"

var soilUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-soil/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7"

var checkboxAutomatic = document.querySelector('input[type="checkbox"]');

var repeat = null;
var intervalTime = 4000;

// send a message
function turnOn() {

    setTimeout(() => {
        console.log('Turn on');
        document.getElementById("textOn").style.display = "block";
        document.getElementById("textOff").style.display = "none";
        clearInterval(repeat);
        client.send(topic, messageOn);
    }, 1000);
}

function turnOff() {

    setTimeout(() => {
        console.log('Turn off');
        document.getElementById("textOn").style.display = "none";
        document.getElementById("textOff").style.display = "block";
        clearInterval(repeat);
        client.send(topic, messageOff);
    }, 1000);
}

// called when the client connects
function onConnect() {
    client.subscribe(topic);
    console.log("Connect successfully");
    loader();
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

    repeat = setInterval(() => {
        loader();
    }, intervalTime);
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

function reqListenerRelay() {
    var chartDataWaterPumpRelay = [];
    var labelDataWaterPumpRelay = [];

    var res = JSON.parse(this.responseText);

    for (var i = 0 ; i < res.length ; i++) {
        chartDataWaterPumpRelay.push(JSON.parse(res[i].value).data);
        labelDataWaterPumpRelay.push(res[i].created_at);
    }

    console.log('chart data water pump relay:', chartDataWaterPumpRelay);
    console.log('label data water pump relay:', labelDataWaterPumpRelay);

    var currentStateOfWaterPump = chartDataWaterPumpRelay[0];
    if (currentStateOfWaterPump == 1) {
        document.getElementById("textOn").style.display = "block";
        document.getElementById("textOff").style.display = "none";
    }
    else {
        document.getElementById("textOn").style.display = "none";
        document.getElementById("textOff").style.display = "block";
    }

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
    numberOfWaterPumpOn.push(currentNumberWaterPumpOn);
    numberOfWaterPumpOff.push(currentNumberWaterPumpOff);

    water_pump_chart.data.labels = labelDataWaterPumpRelayDate;
    water_pump_chart.data.datasets[0].data = numberOfWaterPumpOn;
    water_pump_chart.data.datasets[1].data = numberOfWaterPumpOff;

    water_pump_chart.update(); 
}

function reqListenerSoil() {
    var chartDataSoil = [];

    var res = JSON.parse(this.responseText);

    for (var i = 0 ; i < res.length ; i++) {
        chartDataSoil.push(JSON.parse(res[i].value).data);
    }

    console.log('chart data light:', chartDataSoil);

    var currentSoilValue = parseInt(chartDataSoil[0]);
    var currentWaterPumpRelayValue = null;

    document.getElementById("textCurrentSoilValue").style.display = "block";
    document.getElementById("textCurrentSoilValue").innerHTML = currentSoilValue;

    var currentRelayOn = document.getElementById("textOn").style.display;
    var currentRelayOff = document.getElementById("textOff").style.display;

    if (currentRelayOn === "block" && currentRelayOff === "none") {
        currentWaterPumpRelayValue = 1;
    }
    else {
        currentWaterPumpRelayValue = 0;
    }

    /*
    console.log(currentRelayOn);
    console.log(currentRelayOff);
    console.log(currentWaterPumpRelayValue);
    */

    if (checkboxAutomatic.checked == true) {
        if (currentSoilValue >= 100 && currentWaterPumpRelayValue == 1) {
            highSoilAlertTrigger();
            turnOff();
        }
        else if (currentSoilValue < 100 && currentWaterPumpRelayValue == 0) {
            lowSoilAlertTrigger();
            turnOn();
        }
    }
    else {
        if (currentSoilValue >= 100 && currentWaterPumpRelayValue == 1) {
            highSoilAlertTrigger();
        }
        else if (currentSoilValue < 100 && currentWaterPumpRelayValue == 0) {
            lowSoilAlertTrigger();
        }
    }
}

function loadRelay() {
    var waterPumpRelayXmlHttpReq = new XMLHttpRequest();
    waterPumpRelayXmlHttpReq.onload = reqListenerRelay;
    waterPumpRelayXmlHttpReq.open("GET", relayUrl, true);
    waterPumpRelayXmlHttpReq.send();
}

function loadSoil() {
    var soilXmlHttpReq = new XMLHttpRequest();
    soilXmlHttpReq.onload = reqListenerSoil;
    soilXmlHttpReq.open("GET", soilUrl, true);
    soilXmlHttpReq.send();
}

function loader() {
    loadRelay();
    setTimeout(() => {
        loadSoil();
    }, 1000);
}

repeat = setInterval(() => {
    loader();
}, intervalTime);

lowLightAlertHide();
highLightAlertHide();
lowSoilAlertHide();
highSoilAlertHide();