var port        = 443;
var host        = "io.adafruit.com";
var username    = "tphiepbk";
var password    = "aio_vjlb21Jsae7D86XwPisWl5WVvud7";

var topic = "tphiepbk/feeds/bk-iot-water-pump-relay";

var messageOn = JSON.stringify({"id" : 11, "name": "RELAY", "data" : 1 , "unit" : ""});
var messageOff = JSON.stringify({"id" : 11, "name": "RELAY", "data" : 0 , "unit" : ""});

var dataUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-water-pump-relay/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7"

var feedsArray = [];
var feedsArrayCreatedAt = [];

var client;
var table = document.getElementById("recent-feeds-table");

document.addEventListener('DOMContentLoaded', function () {
    var checkbox = document.querySelector('input[type="checkbox"]');

    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
            turnOn();
            console.log('Turn on');
        } else {
            turnOff();
            console.log('Turn off');
        }
    });
});

// send a message
function turnOn () {
    client.send(topic, messageOn);
}

function turnOff () {
    client.send(topic, messageOff);
}

function getData() {

    feedsArray = [];
    feedsArrayCreatedAt = [];

    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', dataUrl, true);
    req.onload  = function() {
        var jsonResponse = req.response;
        console.log(jsonResponse.length);
        console.log(JSON.parse(jsonResponse[0].value).data);

        var checkbox = document.querySelector('input[type="checkbox"]');

        var toggle = JSON.parse(jsonResponse[0].value).data;
        if (toggle == 1) {
            checkbox.checked = true;
        }
        else {
            checkbox.checked = false;
        }

        for (var i = 0 ; i < 10 ; i++) {
            feedsArray.push(JSON.parse(jsonResponse[i].value));
            feedsArrayCreatedAt.push(jsonResponse[i].created_at);
        }
    };
    req.send();
}

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

function clearTable() {
    while (table.rows.length != 1) {
        table.deleteRow(1);
    }
}

function refreshTable() {
    var cols = ['id', 'name', 'data', 'unit'];

    clearTable();
    
    // Adding the data to the table
    for (var i = 0; i < feedsArray.length; i++) {
        var newRow = table.insertRow(-1);
        for (var j = 0; j < 6 ; j++) {
            if (j === 0) {
                var newCell = newRow.insertCell(-1);
                var newText = document.createTextNode(i+1);
                newCell.appendChild(newText);
            }
            else if (j === 5) {
                var newCell = newRow.insertCell(-1);
                var newText = document.createTextNode(feedsArrayCreatedAt[i]);
                newCell.appendChild(newText);
            }
            else {
                var newCell = newRow.insertCell(-1);
                var newText = document.createTextNode(feedsArray[i][cols[j-1]]);
                newCell.appendChild(newText);
            }
        }
    }
}	

init();
refreshTable();

var intervalId = window.setInterval(function(){
    getData();
}, 1000);