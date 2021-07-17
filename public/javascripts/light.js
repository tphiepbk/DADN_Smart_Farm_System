var socket = io('http://localhost:3000/', {
    reconnectionDelayMax: 7000
});

var port = 443;
var host = "io.adafruit.com";
var username = "tphiepbk";
var password = "aio_bSDL29hJEUFdmxkrj3OpHsNLJqxZ";

var topic = "tphiepbk/feeds/bk-iot-light-relay";

var messageOn = JSON.stringify({ "id": "11", "name": "RELAY", "data": "1", "unit": "" });
var messageOff = JSON.stringify({ "id": "11", "name": "RELAY", "data": "0", "unit": "" });

var relayUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-light-relay/data.json?X-AIO-Key=aio_bSDL29hJEUFdmxkrj3OpHsNLJqxZ"

var lightUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-light/data.json?X-AIO-Key=aio_bSDL29hJEUFdmxkrj3OpHsNLJqxZ"

var checkboxAutomatic = document.querySelector('input[type="checkbox"]');

checkboxAutomatic.addEventListener('change', manualSwitch);

function manualSwitch() {
    if (checkboxAutomatic.checked == true) {
        document.getElementById("manual-switch").style.pointerEvents= "none";
        document.getElementById("manual-switch").style.opacity= "0.5";
    }
    else {
        document.getElementById("manual-switch").style.pointerEvents= "auto";
        document.getElementById("manual-switch").style.opacity= "1";
    }
}

var repeat = null;
var intervalTime = 3000;

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
    //loadRelay();
    //loadLight();
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
        //loadRelay();
        //loadLight();
    }, intervalTime);
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

function calculateDuration(timestampA, timestampB) {
    var datetimeA = new Date(timestampA);
    var datetimeB = new Date(timestampB);

    var ms = moment.utc(datetimeB).diff(moment.utc(datetimeA));
    var d = moment.duration(ms);

    return d.asHours();
}

// * For light chart
var ctxLight = document.getElementById("light_chart").getContext("2d");

var light_chart = new Chart(ctxLight, {
    data: {
        labels: [],
        datasets: [{
            type: 'bar',
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
            type: 'bar',
            data: [],
            backgroundColor: [
                'rgb(255, 0, 0)'
            ],
            borderColor: [
                'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        },
        {
            type: 'bar',
            label: 'Working hours',
            data: [],
            backgroundColor: [
                'rgb(87, 216, 255)'
            ],
            borderColor: [
                'rgb(112, 128, 144)'
            ],
            borderWidth: 1
        }
        ]
    }
});

var sortedLightByDay = true;
var sortedLightByMonth = false;
var sortedLightByYear = false;

function reqListenerRelay() {
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

        var currentDate = null;
        if (sortedLightByDay == true) {
            currentDate = labelDataLightRelay[i].substr(0, 10);
        }
        else if (sortedLightByMonth == true) {
            currentDate = labelDataLightRelay[i].substr(0, 7);
        }
        else {
            currentDate = labelDataLightRelay[i].substr(0, 4);
        }

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
    numberOfLightOn.push(currentNumberLightOn);
    numberOfLightOff.push(currentNumberLightOff);

    if (sortedLightByDay == true) {
        light_chart.data.labels = labelDataLightRelayDate.slice(0, 7);
        light_chart.data.datasets[0].data = numberOfLightOn.slice(0, 7);
        light_chart.data.datasets[1].data = numberOfLightOff.slice(0, 7);
    }
    else if (sortedLightByMonth == true) {
        light_chart.data.labels = labelDataLightRelayDate.slice(0, 12);
        light_chart.data.datasets[0].data = numberOfLightOn.slice(0, 12);
        light_chart.data.datasets[1].data = numberOfLightOff.slice(0, 12);
    }
    else {
        light_chart.data.labels = labelDataLightRelayDate.slice(0, 5);
        light_chart.data.datasets[0].data = numberOfLightOn.slice(0, 5);
        light_chart.data.datasets[1].data = numberOfLightOff.slice(0, 5);
    }

    // * Calculate working hours
    var currentDate_labelDataLightRelay_workingHours = [];
    var currentDate_chartDataLightRelay_workingHours = [];

    var labelDataLightRelay_workingHours = [];
    var chartDataLightRelay_workingHours = [];

    var dateIndex = 0;

    for (var i = 0 ; i < labelDataLightRelay.length ; i++) {

        if (currentDate_labelDataLightRelay_workingHours.length == 0) {
            currentDate_chartDataLightRelay_workingHours.push(chartDataLightRelay[i]);
            currentDate_labelDataLightRelay_workingHours.push(labelDataLightRelay[i]);
        }
        else {
            var currentDate = null;
            var previousDate = null;

            if (sortedLightByDay == true) {
                currentDate = labelDataLightRelay[i].substr(0, 10);
                previousDate = currentDate_labelDataLightRelay_workingHours[currentDate_labelDataLightRelay_workingHours.length-1].substr(0, 10);
            }
            else if (sortedLightByMonth == true) {
                currentDate = labelDataLightRelay[i].substr(0, 7);
                previousDate = currentDate_labelDataLightRelay_workingHours[currentDate_labelDataLightRelay_workingHours.length-1].substr(0, 7);
            }
            else {
                currentDate = labelDataLightRelay[i].substr(0, 4);
                previousDate = currentDate_labelDataLightRelay_workingHours[currentDate_labelDataLightRelay_workingHours.length-1].substr(0, 4);
            }

            if (previousDate == currentDate) {
                currentDate_chartDataLightRelay_workingHours.push(chartDataLightRelay[i]);
                currentDate_labelDataLightRelay_workingHours.push(labelDataLightRelay[i]);

                if (i == labelDataLightRelay.length - 1) {

                    console.log("Log : ");

                    console.log("dateIndex " + dateIndex);

                    currentDate_chartDataLightRelay_workingHours.reverse();
                    currentDate_labelDataLightRelay_workingHours.reverse();

                    console.log(currentDate_chartDataLightRelay_workingHours);
                    console.log(currentDate_labelDataLightRelay_workingHours);

                    var slow = 0;
                    var currentDate_totalWorkingHours = 0;
                    while (slow < currentDate_chartDataLightRelay_workingHours.length) {
                        var found = false;
                        if (currentDate_chartDataLightRelay_workingHours[slow] == "1") {
                            var fast = slow + 1;
                            while (fast < currentDate_chartDataLightRelay_workingHours.length) {
                                if (currentDate_chartDataLightRelay_workingHours[fast] == "0") {
                                    currentDate_totalWorkingHours += calculateDuration(currentDate_labelDataLightRelay_workingHours[slow], currentDate_labelDataLightRelay_workingHours[fast]);
                                    slow = fast + 1;
                                    found = true;
                                    break;
                                }
                                else {
                                    fast++;
                                }
                            }
                            if (found == false) {
                                if (sortedLightByDay == true) {
                                    var endOfTheDate = previousDate + "T23:59:59Z";
                                }
                                else if (sortedLightByMonth == true) {
                                    var month = previousDate.substr(5, 2);
                                    var endOfTheDate = previousDate;
                                    if (month == "04" || month == "06" || month == "09" || month == "11") {
                                        endOfTheDate += "-30T23:59:59Z";
                                    }
                                    else if (month == "02") {
                                        var year = parseInt(previousDate.substr(0,4));
                                        if (year % 4 == 0) {
                                            endOfTheDate += "-29T23:59:59Z";
                                        }
                                        else {
                                            endOfTheDate += "-28T23:59:59Z";
                                        }
                                    }
                                    else {
                                        endOfTheDate += "-31T23:59:59Z";
                                    }
                                }
                                else {
                                    var endOfTheDate = previousDate + "-12-31T23:59:59Z";
                                }

                                if (dateIndex == 0) {
                                    var d = new Date();
                                    endOfTheDate = d.toISOString();
                                    console.log(endOfTheDate);
                                    console.log("Set end of the date to current datetime");
                                }

                                currentDate_totalWorkingHours += calculateDuration(currentDate_labelDataLightRelay_workingHours[slow], endOfTheDate);
                                slow = currentDate_chartDataLightRelay_workingHours.length;
                            }
                        }
                        else {
                            slow++;
                        }
                    }

                    chartDataLightRelay_workingHours.push(currentDate_totalWorkingHours);
                    labelDataLightRelay_workingHours.push(currentDate);

                    dateIndex++;
                }
            }
            else {
                //* testing
                console.log("dateIndex " + dateIndex);

                console.log("Original Log : ");

                currentDate_chartDataLightRelay_workingHours.reverse();
                currentDate_labelDataLightRelay_workingHours.reverse();

                console.log(currentDate_chartDataLightRelay_workingHours);
                console.log(currentDate_labelDataLightRelay_workingHours);

                currentDate_chartDataLightRelay_workingHours.reverse();
                currentDate_labelDataLightRelay_workingHours.reverse();
                //* end testing

                if (chartDataLightRelay[i] == "1") {
                    if (sortedLightByDay == true) {
                        var startOfTheDate = previousDate + "T00:00:00Z";
                    }
                    else if (sortedLightByMonth == true) {
                        var startOfTheDate = previousDate + "-01T00:00:00Z";
                    }
                    else {
                        var startOfTheDate = previousDate + "-01-01T00:00:00Z";
                    }
                    currentDate_chartDataLightRelay_workingHours.push("1");
                    currentDate_labelDataLightRelay_workingHours.push(startOfTheDate);
                }

                currentDate_chartDataLightRelay_workingHours.reverse();
                currentDate_labelDataLightRelay_workingHours.reverse();

                //* testing
                console.log("Modified Log : ");
                console.log(currentDate_chartDataLightRelay_workingHours);
                console.log(currentDate_labelDataLightRelay_workingHours);
                //* end testing

                var slow = 0;
                var currentDate_totalWorkingHours = 0;
                while (slow < currentDate_chartDataLightRelay_workingHours.length) {
                    var found = false;
                    if (currentDate_chartDataLightRelay_workingHours[slow] == "1") {
                        var fast = slow + 1;
                        while (fast < currentDate_chartDataLightRelay_workingHours.length) {
                            if (currentDate_chartDataLightRelay_workingHours[fast] == "0") {
                                currentDate_totalWorkingHours += calculateDuration(currentDate_labelDataLightRelay_workingHours[slow], currentDate_labelDataLightRelay_workingHours[fast]);
                                slow = fast + 1;
                                found = true;
                                break;
                            }
                            else {
                                fast++;
                            }
                        }
                        if (found == false) {
                            var endOfTheDate = null;
                            if (sortedLightByDay == true) {
                                endOfTheDate = previousDate + "T23:59:59Z";
                            }
                            else if (sortedLightByMonth == true) {
                                var month = previousDate.substr(5, 2);
                                endOfTheDate = previousDate;
                                if (month == "04" || month == "06" || month == "09" || month == "11") {
                                    endOfTheDate += "-30T23:59:59Z";
                                }
                                else if (month == "02") {
                                    var year = parseInt(previousDate.substr(0,4));
                                    if (year % 4 == 0) {
                                        endOfTheDate += "-29T23:59:59Z";
                                    }
                                    else {
                                        endOfTheDate += "-28T23:59:59Z";
                                    }
                                }
                                else {
                                    endOfTheDate += "-31T23:59:59Z";
                                }
                            }
                            else {
                                endOfTheDate = previousDate + "-12-31T23:59:59Z";
                            }

                            if (dateIndex == 0) {
                                var d = new Date();
                                endOfTheDate = d.toISOString();
                                console.log(endOfTheDate);
                                console.log("Set end of the date to current datetime");
                            }

                            currentDate_totalWorkingHours += calculateDuration(currentDate_labelDataLightRelay_workingHours[slow], endOfTheDate);
                            slow = currentDate_chartDataLightRelay_workingHours.length;
                        }
                    }
                    else {
                        slow++;
                    }
                }

                chartDataLightRelay_workingHours.push(currentDate_totalWorkingHours);
                labelDataLightRelay_workingHours.push(currentDate);

                dateIndex++;

                currentDate_labelDataLightRelay_workingHours = [];
                currentDate_chartDataLightRelay_workingHours = [];

                currentDate_chartDataLightRelay_workingHours.push(chartDataLightRelay[i]);
                currentDate_labelDataLightRelay_workingHours.push(labelDataLightRelay[i]);
            }
        }
    }
    // * 
    console.log("working hours");
    console.log(chartDataLightRelay_workingHours);
    light_chart.data.datasets[2].data = chartDataLightRelay_workingHours;

    if (sortedLightByDay == true) {
        light_chart.data.datasets[2].data = chartDataLightRelay_workingHours.splice(0, 7);
    }
    else if (sortedLightByMonth == true) {
        light_chart.data.datasets[2].data = chartDataLightRelay_workingHours.splice(0, 12);
    }
    else {
        light_chart.data.datasets[2].data = chartDataLightRelay_workingHours.splice(0, 5);
    }

    light_chart.update(); 
}

function reqListenerLight() {
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

    if (checkboxAutomatic.checked == true) {
        if (currentLightValue >= 100 && currentLightRelayValue == 1) {
            highLightAlertTrigger();
            turnOff();
        }
        else if (currentLightValue < 100 && currentLightRelayValue == 0) {
            lowLightAlertTrigger();
            turnOn();
        }
    }
    else {
        if (currentLightValue >= 100 && currentLightRelayValue == 1) {
            highLightAlertTrigger();
        }
        else if (currentLightValue < 100 && currentLightRelayValue == 0) {
            lowLightAlertTrigger();
        }
    }
}

function loadRelay() {
    var lightRelayXmlHttpReq = new XMLHttpRequest();
    lightRelayXmlHttpReq.onload = reqListenerRelay;
    lightRelayXmlHttpReq.open("GET", relayUrl, true);
    lightRelayXmlHttpReq.send();
}

function loadLight() {
    var lightXmlHttpReq = new XMLHttpRequest();
    lightXmlHttpReq.onload = reqListenerLight;
    lightXmlHttpReq.open("GET", lightUrl, true);
    lightXmlHttpReq.send();
}

function loader() {
    loadRelay();
    setTimeout(() => {
        loadLight();
    }, 1000);
}

function sortStyle(typeOfSort) {
    if (typeOfSort == "day") {
        sortedLightByDay = true;
        sortedLightByMonth = false;
        sortedLightByYear = false;
    }
    else if (typeOfSort == "month") {
        sortedLightByDay = false;
        sortedLightByMonth = true;
        sortedLightByYear = false;
    }
    else {
        sortedLightByDay = false;
        sortedLightByMonth = false;
        sortedLightByYear = true;
    }
}

repeat = setInterval(() => {
    loader();
    //loadRelay();
    //loadLight();
}, intervalTime);

lowLightAlertHide();
highLightAlertHide();
lowSoilAlertHide();
highSoilAlertHide();