var socket = io('http://localhost:3000/', {
    reconnectionDelayMax: 7000
});

var port = 443;
var host = "io.adafruit.com";
var username = "tphiepbk";
var password = "aio_vjlb21Jsae7D86XwPisWl5WVvud7";

var topic = "tphiepbk/feeds/bk-iot-light-relay";

var messageOn = JSON.stringify({ "id": "11", "name": "RELAY", "data": "1", "unit": "" });
var messageOff = JSON.stringify({ "id": "11", "name": "RELAY", "data": "0", "unit": "" });

var relayUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-light-relay/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7"

var lightUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-light/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7"

var checkboxAutomatic = document.querySelector('input[type="checkbox"]');

var repeat = null;

// send a message
function turnOn() {
    console.log('Turn on');
    document.getElementById("textOn").style.display = "block";
    document.getElementById("textOff").style.display = "none";
    client.send(topic, messageOn);

    clearInterval(repeat);
}

function turnOff() {
    console.log('Turn off');
    document.getElementById("textOn").style.display = "none";
    document.getElementById("textOff").style.display = "block";
    client.send(topic, messageOff);

    clearInterval(repeat);
}

// called when the client connects
function onConnect() {
    client.subscribe(topic);
    console.log("Connect successfully");
    fetching();
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
        fetching();
    }, 5000);
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

// * For light chart
var ctxLight = document.getElementById("light_chart").getContext("2d");

var light_chart = new Chart(ctxLight, {
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

function fetching() {

    var lightRelayXmlHttpReq = new XMLHttpRequest();
    lightRelayXmlHttpReq.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var chartDataLightRelay = [];
            var labelDataLightRelay = [];

            var res = JSON.parse(this.responseText);

            for (var i = 0 ; i < res.length ; i++) {
                chartDataLightRelay.push(JSON.parse(res[i].value).data);
                labelDataLightRelay.push(res[i].created_at);
            }

            console.log('chart data light relay:', chartDataLightRelay);
            console.log('label data light relay:', labelDataLightRelay);

            var currentStateOfLight = chartDataLightRelay[0];
            if (currentStateOfLight == 1) {
                document.getElementById("textOn").style.display = "block";
                document.getElementById("textOff").style.display = "none";
            }
            else {
                document.getElementById("textOn").style.display = "none";
                document.getElementById("textOff").style.display = "block";
            }

            var labelDataLightRelayDate = [];
            var numberOfLightOn = [];
            var numberOfLightOff = [];

            var currentNumberLightOn = 0;
            var currentNumberLightOff = 0;

            for (var i = 0 ; i < labelDataLightRelay.length ; i++) {
                var currentDate = labelDataLightRelay[i].substr(0, 10);
                var currentStateOfSwitch = parseInt(chartDataLightRelay[i]);

                if (currentDate != labelDataLightRelayDate[labelDataLightRelayDate.length - 1] && labelDataLightRelayDate.length != 0) {
                    numberOfLightOn.push(currentNumberLightOn);
                    numberOfLightOff.push(currentNumberLightOff);
                    currentNumberLightOff = 0;
                    currentNumberLightOn = 0;
                }

                if (currentStateOfSwitch == 1) {
                    currentNumberLightOn++;
                }
                else {
                    currentNumberLightOff++;
                }

                if (labelDataLightRelayDate.length == 0 || labelDataLightRelayDate[labelDataLightRelayDate.length-1] !== currentDate) {
                    labelDataLightRelayDate.push(currentDate);
                }
            }

            /*
            console.log(labelDataLightRelayDate);
            console.log(numberOfLightOn);
            console.log(numberOfLightOff);
            */

            light_chart.data.labels = labelDataLightRelayDate;
            light_chart.data.datasets[0].data = numberOfLightOn;
            light_chart.data.datasets[1].data = numberOfLightOff;

            light_chart.update(); 
        }
    };

    lightRelayXmlHttpReq.open("GET", relayUrl, false);
    lightRelayXmlHttpReq.send();

    var lightXmlhttpReq = new XMLHttpRequest();
    lightXmlhttpReq.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            var chartDataLight = [];

            var res = JSON.parse(this.responseText);

            for (var i = 0 ; i < res.length ; i++) {
                chartDataLight.push(JSON.parse(res[i].value).data);
            }

            console.log('chart data light:', chartDataLight);

            var currentLightValue = parseInt(chartDataLight[0]);
            var currentLightRelayValue = null;

            document.getElementById("textCurrentLightValue").style.display = "block";
            document.getElementById("textCurrentLightValue").innerHTML = currentLightValue;

            var currentRelayOn = document.getElementById("textOn").style.display;
            var currentRelayOff = document.getElementById("textOff").style.display;

            if (currentRelayOn === "block" && currentRelayOff === "none") {
                currentLightRelayValue = 1;
            }
            else {
                currentLightRelayValue = 0;
            }

            /*
            console.log(currentRelayOn);
            console.log(currentRelayOff);
            console.log(currentLightRelayValue);
            */

            if (checkboxAutomatic.checked == true) {
                if (currentLightValue >= 100 && currentLightRelayValue == 1) {
                    turnOff();
                }
                else if (currentLightValue < 100 && currentLightRelayValue == 0) {
                    turnOn();
                }
            }
        }
    };
    lightXmlhttpReq.open("GET", lightUrl, false);
    lightXmlhttpReq.send();
};

repeat = setInterval(() => {
    fetching();
}, 5000);