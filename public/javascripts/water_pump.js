const aio_key = getAIOKey();

var port        = 443;
var host        = "io.adafruit.com";
var username    = "tphiepbk";
var password    = aio_key;

var topic = "tphiepbk/feeds/bk-iot-water-pump-relay";

var messageOn = JSON.stringify({"id" : "11", "name": "RELAY", "data" : "1" , "unit" : ""});
var messageOff = JSON.stringify({"id" : "11", "name": "RELAY", "data" : "0" , "unit" : ""});

var relayUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-water-pump-relay/data.json?X-AIO-Key=" + aio_key;

var soilUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-soil/data.json?X-AIO-Key=" + aio_key;

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

function calculateDuration(timestampA, timestampB) {
    var datetimeA = new Date(timestampA);
    var datetimeB = new Date(timestampB);

    var ms = moment.utc(datetimeB).diff(moment.utc(datetimeA));
    var d = moment.duration(ms);

    return d.asHours();
}

// * For light chart
var ctxWaterPump = document.getElementById("water_pump_chart").getContext("2d");

var water_pump_chart = new Chart(ctxWaterPump, {
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

var sortedWaterPumpByDay = true;
var sortedWaterPumpByMonth = false;
var sortedWaterPumpByYear = false

function loadChartData(chartDataWaterPumpRelay, labelDataWaterPumpRelay) {
    var labelDataWaterPumpRelayDate = [];
    var numberOfWaterPumpOn = [];
    var numberOfWaterPumpOff = [];

    var currentNumberWaterPumpOn = 0;
    var currentNumberWaterPumpOff = 0;

    for (var i = 0 ; i < labelDataWaterPumpRelay.length ; i++) {

        var currentDate = null;
        if (sortedWaterPumpByDay == true) {
            currentDate = labelDataWaterPumpRelay[i].substr(0, 10);
        }
        else if (sortedWaterPumpByMonth == true) {
            currentDate = labelDataWaterPumpRelay[i].substr(0, 7);
        }
        else {
            currentDate = labelDataWaterPumpRelay[i].substr(0, 4);
        }

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

    if (sortedWaterPumpByDay == true) {
        water_pump_chart.data.labels = labelDataWaterPumpRelayDate.splice(0, 7);
        water_pump_chart.data.datasets[0].data = numberOfWaterPumpOn.splice(0, 7);
        water_pump_chart.data.datasets[1].data = numberOfWaterPumpOff.splice(0, 7);
    }
    else if (sortedWaterPumpByMonth == true) {
        water_pump_chart.data.labels = labelDataWaterPumpRelayDate.splice(0, 12);
        water_pump_chart.data.datasets[0].data = numberOfWaterPumpOn.splice(0, 12);
        water_pump_chart.data.datasets[1].data = numberOfWaterPumpOff.splice(0, 12);
    }
    else {
        water_pump_chart.data.labels = labelDataWaterPumpRelayDate.splice(0, 5);
        water_pump_chart.data.datasets[0].data = numberOfWaterPumpOn.splice(0, 5);
        water_pump_chart.data.datasets[1].data = numberOfWaterPumpOff.splice(0, 5);
    }

    // * Calculate working hours
    var currentDate_labelDataWaterPumpRelay_workingHours = [];
    var currentDate_chartDataWaterPumpRelay_workingHours = [];

    var labelDataWaterPumpRelay_workingHours = [];
    var chartDataWaterPumpRelay_workingHours = [];

    var dateIndex = 0;

    for (var i = 0 ; i < labelDataWaterPumpRelay.length ; i++) {

        if (currentDate_labelDataWaterPumpRelay_workingHours.length == 0) {
            currentDate_chartDataWaterPumpRelay_workingHours.push(chartDataWaterPumpRelay[i]);
            currentDate_labelDataWaterPumpRelay_workingHours.push(labelDataWaterPumpRelay[i]);
        }
        else {
            var currentDate = null;
            var previousDate = null;

            if (sortedWaterPumpByDay == true) {
                currentDate = labelDataWaterPumpRelay[i].substr(0, 10);
                previousDate = currentDate_labelDataWaterPumpRelay_workingHours[currentDate_labelDataWaterPumpRelay_workingHours.length-1].substr(0, 10);
            }
            else if (sortedWaterPumpByMonth == true) {
                currentDate = labelDataWaterPumpRelay[i].substr(0, 7);
                previousDate = currentDate_labelDataWaterPumpRelay_workingHours[currentDate_labelDataWaterPumpRelay_workingHours.length-1].substr(0, 7);
            }
            else {
                currentDate = labelDataWaterPumpRelay[i].substr(0, 4);
                previousDate = currentDate_labelDataWaterPumpRelay_workingHours[currentDate_labelDataWaterPumpRelay_workingHours.length-1].substr(0, 4);
            }

            if (previousDate == currentDate) {
                currentDate_chartDataWaterPumpRelay_workingHours.push(chartDataWaterPumpRelay[i]);
                currentDate_labelDataWaterPumpRelay_workingHours.push(labelDataWaterPumpRelay[i]);

                if (i == labelDataWaterPumpRelay.length - 1) {

                    console.log("Log : ");

                    console.log("dateIndex " + dateIndex);

                    currentDate_chartDataWaterPumpRelay_workingHours.reverse();
                    currentDate_labelDataWaterPumpRelay_workingHours.reverse();

                    console.log(currentDate_chartDataWaterPumpRelay_workingHours);
                    console.log(currentDate_labelDataWaterPumpRelay_workingHours);

                    var slow = 0;
                    var currentDate_totalWorkingHours = 0;
                    while (slow < currentDate_chartDataWaterPumpRelay_workingHours.length) {
                        var found = false;
                        if (currentDate_chartDataWaterPumpRelay_workingHours[slow] == "1") {
                            var fast = slow + 1;
                            while (fast < currentDate_chartDataWaterPumpRelay_workingHours.length) {
                                if (currentDate_chartDataWaterPumpRelay_workingHours[fast] == "0") {
                                    currentDate_totalWorkingHours += calculateDuration(currentDate_labelDataWaterPumpRelay_workingHours[slow], currentDate_labelDataWaterPumpRelay_workingHours[fast]);
                                    slow = fast + 1;
                                    found = true;
                                    break;
                                }
                                else {
                                    fast++;
                                }
                            }
                            if (found == false) {
                                if (sortedWaterPumpByDay == true) {
                                    var endOfTheDate = previousDate + "T23:59:59Z";
                                }
                                else if (sortedWaterPumpByMonth == true) {
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
                                    d = d.toISOString();

                                    if (sortedLightByDay == true) {
                                        if (d.substr(0, 10) == previousDate) {
                                            endOfTheDate = d;
                                        }
                                    }
                                    else if (sortedLightByMonth == true) {
                                        if (d.substr(0, 7) == previousDate) {
                                            endOfTheDate = d;
                                        }
                                    }
                                    else {
                                        if (d.substr(0, 4) == previousDate) {
                                            endOfTheDate = d;
                                        }
                                    }

                                    console.log(endOfTheDate);
                                    console.log("Set end of the date to current datetime");
                                }

                                currentDate_totalWorkingHours += calculateDuration(currentDate_labelDataWaterPumpRelay_workingHours[slow], endOfTheDate);
                                slow = currentDate_chartDataWaterPumpRelay_workingHours.length;
                            }
                        }
                        else {
                            slow++;
                        }
                    }

                    chartDataWaterPumpRelay_workingHours.push(currentDate_totalWorkingHours);
                    labelDataWaterPumpRelay_workingHours.push(currentDate);
                    
                    dateIndex++;
                }
            }
            else {
                //* testing

                console.log("dateIndex " + dateIndex);

                console.log("Original Log : ");

                currentDate_chartDataWaterPumpRelay_workingHours.reverse();
                currentDate_labelDataWaterPumpRelay_workingHours.reverse();

                console.log(currentDate_chartDataWaterPumpRelay_workingHours);
                console.log(currentDate_labelDataWaterPumpRelay_workingHours);

                currentDate_chartDataWaterPumpRelay_workingHours.reverse();
                currentDate_labelDataWaterPumpRelay_workingHours.reverse();
                //* end testing

                if (chartDataWaterPumpRelay[i] == "1") {
                    if (sortedWaterPumpByDay == true) {
                        var startOfTheDate = previousDate + "T00:00:00Z";
                    }
                    else if (sortedWaterPumpByMonth == true) {
                        var startOfTheDate = previousDate + "-01T00:00:00Z";
                    }
                    else {
                        var startOfTheDate = previousDate + "-01-01T00:00:00Z";
                    }
                    currentDate_chartDataWaterPumpRelay_workingHours.push("1");
                    currentDate_labelDataWaterPumpRelay_workingHours.push(startOfTheDate);
                }

                currentDate_chartDataWaterPumpRelay_workingHours.reverse();
                currentDate_labelDataWaterPumpRelay_workingHours.reverse();

                //* testing
                console.log("Modified Log : ");
                console.log(currentDate_chartDataWaterPumpRelay_workingHours);
                console.log(currentDate_labelDataWaterPumpRelay_workingHours);
                //* end testing

                var slow = 0;
                var currentDate_totalWorkingHours = 0;
                while (slow < currentDate_chartDataWaterPumpRelay_workingHours.length) {
                    var found = false;
                    if (currentDate_chartDataWaterPumpRelay_workingHours[slow] == "1") {
                        var fast = slow + 1;
                        while (fast < currentDate_chartDataWaterPumpRelay_workingHours.length) {
                            if (currentDate_chartDataWaterPumpRelay_workingHours[fast] == "0") {
                                currentDate_totalWorkingHours += calculateDuration(currentDate_labelDataWaterPumpRelay_workingHours[slow], currentDate_labelDataWaterPumpRelay_workingHours[fast]);
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
                            if (sortedWaterPumpByDay == true) {
                                endOfTheDate = previousDate + "T23:59:59Z";
                            }
                            else if (sortedWaterPumpByMonth == true) {
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
                                d = d.toISOString();

                                if (sortedLightByDay == true) {
                                    if (d.substr(0, 10) == previousDate) {
                                        endOfTheDate = d;
                                    }
                                }
                                else if (sortedLightByMonth == true) {
                                    if (d.substr(0, 7) == previousDate) {
                                        endOfTheDate = d;
                                    }
                                }
                                else {
                                    if (d.substr(0, 4) == previousDate) {
                                        endOfTheDate = d;
                                    }
                                }

                                console.log(endOfTheDate);
                                console.log("Set end of the date to current datetime");
                            }

                            currentDate_totalWorkingHours += calculateDuration(currentDate_labelDataWaterPumpRelay_workingHours[slow], endOfTheDate);
                            slow = currentDate_chartDataWaterPumpRelay_workingHours.length;
                        }
                    }
                    else {
                        slow++;
                    }
                }

                chartDataWaterPumpRelay_workingHours.push(currentDate_totalWorkingHours);
                labelDataWaterPumpRelay_workingHours.push(currentDate);

                dateIndex++;

                currentDate_labelDataWaterPumpRelay_workingHours = [];
                currentDate_chartDataWaterPumpRelay_workingHours = [];

                currentDate_chartDataWaterPumpRelay_workingHours.push(chartDataWaterPumpRelay[i]);
                currentDate_labelDataWaterPumpRelay_workingHours.push(labelDataWaterPumpRelay[i]);
            }
        }
    }
    // * 
    console.log("working hours");
    console.log(chartDataWaterPumpRelay_workingHours);
    water_pump_chart.data.datasets[2].data = chartDataWaterPumpRelay_workingHours;

    if (sortedWaterPumpByDay == true) {
        water_pump_chart.data.datasets[2].data = chartDataWaterPumpRelay_workingHours.splice(0, 7);
    }
    else if (sortedWaterPumpByMonth == true) {
        water_pump_chart.data.datasets[2].data = chartDataWaterPumpRelay_workingHours.splice(0, 12);
    }
    else {
        water_pump_chart.data.datasets[2].data = chartDataWaterPumpRelay_workingHours.splice(0, 5);
    }

    water_pump_chart.update(); 
}

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

function sortStyle(typeOfSort) {
    if (typeOfSort == "day") {
        sortedWaterPumpByDay = true;
        sortedWaterPumpByMonth = false;
        sortedWaterPumpByYear = false;
    }
    else if (typeOfSort == "month") {
        sortedWaterPumpByDay = false;
        sortedWaterPumpByMonth = true;
        sortedWaterPumpByYear = false;
    }
    else {
        sortedWaterPumpByDay = false;
        sortedWaterPumpByMonth = false;
        sortedWaterPumpByYear = true;
    }
}

const socket = io('http://localhost:3000/', {
    reconnectionDelayMax: 7000
});

socket.on("send_data", function (element1, element2, element3, element4, element5, element6, element7, element8) {
    /*
    console.log("Received : ");
    console.log(element1);
    console.log(element2);
    */
    loadChartData(element7, element8);
});

repeat = setInterval(() => {
    loader();
}, intervalTime);

lowLightAlertHide();
highLightAlertHide();
lowSoilAlertHide();
highSoilAlertHide();