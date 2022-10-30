const port        = 443;
const host        = "io.adafruit.com";

const username_ada    = "tphiepbk";
const password_ada    = "aio_Lzjf98yFKjage19nOWPKGJHENd1U";
const topic = "tphiepbk/feeds/de-smart-farm.de-smart-farm-water-pump-relay";

const messageOn = "1";
const messageOff = "0";

const soilUrl = get_soilUrl();
const relayUrl = get_waterPumpRelayUrl();

const intervalTime = 3000;

const checkboxAutomatic = document.querySelector('input[type="checkbox"]');

checkboxAutomatic.addEventListener('change', () => {
  if (checkboxAutomatic.checked == true) {
    document.getElementById("manual-switch").style.pointerEvents= "none";
    document.getElementById("manual-switch").style.opacity= "0.5";
  }
  else {
    document.getElementById("manual-switch").style.pointerEvents= "auto";
    document.getElementById("manual-switch").style.opacity= "1";
  }
});

// send a message
const turnOn = () => {
    setTimeout(() => {
        console.log('Turn on');
        document.getElementById("textOn").style.display = "block";
        document.getElementById("textOff").style.display = "none";
        clearInterval(repeat);
        client.send(topic, messageOn);
    }, 1000);
}

const turnOff = () => {
    setTimeout(() => {
        console.log('Turn off');
        document.getElementById("textOn").style.display = "none";
        document.getElementById("textOff").style.display = "block";
        clearInterval(repeat);
        client.send(topic, messageOff);
    }, 1000);
}

console.log("Connecting...");
const client = new Paho.MQTT.Client(host, Number(port), "myclientid_" + parseInt(Math.random() * 100, 10));

client.onConnectionLost = (responseObject) => {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
};

client.onMessageArrived = (message) => {
  console.log("onMessageArrived:" + message.payloadString);
  repeat = setInterval(() => {
      loader();
  }, intervalTime);
}

client.connect({ 
    password : password_ada,
    userName: username_ada,
    onSuccess: () => {
      client.subscribe(topic);
      console.log("Connect successfully");
      loader();
    }
});

document.getElementById("textOn").style.display = "none";
document.getElementById("textOff").style.display = "none";
document.getElementById("textCurrentSoilValue").style.display = "none";

const calculateDuration = (timestampA, timestampB) => {
  const datetimeA = new Date(timestampA);
  const datetimeB = new Date(timestampB);

  const ms = moment.utc(datetimeB).diff(moment.utc(datetimeA));
  const d = moment.duration(ms);

  return d.asHours();
}

// * For light chart
const ctxWaterPump = document.getElementById("water_pump_chart").getContext("2d");

const water_pump_chart = new Chart(ctxWaterPump, {
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

let sortedWaterPumpByDay = true;
let sortedWaterPumpByMonth = false;
let sortedWaterPumpByYear = false

const loadChartData = (chartDataWaterPumpRelay, labelDataWaterPumpRelay) => {
    const labelDataWaterPumpRelayDate = [];
    const numberOfWaterPumpOn = [];
    const numberOfWaterPumpOff = [];

    let currentNumberWaterPumpOn = 0;
    let currentNumberWaterPumpOff = 0;

    for (let i = 0 ; i < labelDataWaterPumpRelay.length ; i++) {

        let currentDate = null;
        if (sortedWaterPumpByDay == true) {
            currentDate = labelDataWaterPumpRelay[i].substr(0, 10);
        }
        else if (sortedWaterPumpByMonth == true) {
            currentDate = labelDataWaterPumpRelay[i].substr(0, 7);
        }
        else {
            currentDate = labelDataWaterPumpRelay[i].substr(0, 4);
        }

        let currentStateOfSwitch = parseInt(chartDataWaterPumpRelay[i]);

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
    let currentDate_labelDataWaterPumpRelay_workingHours = [];
    let currentDate_chartDataWaterPumpRelay_workingHours = [];

    const labelDataWaterPumpRelay_workingHours = [];
    const chartDataWaterPumpRelay_workingHours = [];

    let dateIndex = 0;

    for (let i = 0 ; i < labelDataWaterPumpRelay.length ; i++) {

        if (currentDate_labelDataWaterPumpRelay_workingHours.length == 0) {
            currentDate_chartDataWaterPumpRelay_workingHours.push(chartDataWaterPumpRelay[i]);
            currentDate_labelDataWaterPumpRelay_workingHours.push(labelDataWaterPumpRelay[i]);
        }
        else {
            let currentDate = null;
            let previousDate = null;

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

                    let slow = 0;
                    let currentDate_totalWorkingHours = 0;
                    while (slow < currentDate_chartDataWaterPumpRelay_workingHours.length) {
                        let found = false;
                        if (currentDate_chartDataWaterPumpRelay_workingHours[slow] == "1") {
                            let fast = slow + 1;
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
                                    const endOfTheDate = previousDate + "T23:59:59Z";
                                }
                                else if (sortedWaterPumpByMonth == true) {
                                    const month = previousDate.substr(5, 2);
                                    const endOfTheDate = previousDate;
                                    if (month == "04" || month == "06" || month == "09" || month == "11") {
                                        endOfTheDate += "-30T23:59:59Z";
                                    }
                                    else if (month == "02") {
                                        const year = parseInt(previousDate.substr(0,4));
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
                                    const endOfTheDate = previousDate + "-12-31T23:59:59Z";
                                }

                                if (dateIndex == 0) {
                                    const d = new Date();
                                    d = d.toISOString();

                                    if (sortedWaterPumpByDay == true) {
                                        if (d.substr(0, 10) == previousDate) {
                                            endOfTheDate = d;
                                        }
                                    }
                                    else if (sortedWaterPumpByMonth == true) {
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
                let startOfTheDate;

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
                        startOfTheDate = previousDate + "T00:00:00Z";
                    }
                    else if (sortedWaterPumpByMonth == true) {
                        startOfTheDate = previousDate + "-01T00:00:00Z";
                    }
                    else {
                        startOfTheDate = previousDate + "-01-01T00:00:00Z";
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

                let slow = 0;
                let currentDate_totalWorkingHours = 0;
                while (slow < currentDate_chartDataWaterPumpRelay_workingHours.length) {
                    let found = false;
                    if (currentDate_chartDataWaterPumpRelay_workingHours[slow] == "1") {
                        let fast = slow + 1;
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
                            let endOfTheDate = null;
                            if (sortedWaterPumpByDay == true) {
                                endOfTheDate = previousDate + "T23:59:59Z";
                            }
                            else if (sortedWaterPumpByMonth == true) {
                                const month = previousDate.substr(5, 2);
                                endOfTheDate = previousDate;
                                if (month == "04" || month == "06" || month == "09" || month == "11") {
                                    endOfTheDate += "-30T23:59:59Z";
                                }
                                else if (month == "02") {
                                    const year = parseInt(previousDate.substr(0,4));
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
                                let d = new Date();
                                d = d.toISOString();

                                if (sortedWaterPumpByDay == true) {
                                    if (d.substr(0, 10) == previousDate) {
                                        endOfTheDate = d;
                                    }
                                }
                                else if (sortedWaterPumpByMonth == true) {
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

const loadRelay = () => {
    const waterPumpRelayXmlHttpReq = new XMLHttpRequest();
    waterPumpRelayXmlHttpReq.open("GET", relayUrl, true);
    waterPumpRelayXmlHttpReq.addEventListener("load", () => {

      const chartDataWaterPumpRelay = [];
      const labelDataWaterPumpRelay = [];

      const res = JSON.parse(waterPumpRelayXmlHttpReq.responseText);

      console.log(res);

      for (let i = 0 ; i < res.length ; i++) {
          try {
            chartDataWaterPumpRelay.push(res[i].value)
          }
          catch(e) {
            console.log(e)
          }
          labelDataWaterPumpRelay.push(res[i].created_at);
      }

      console.log('chart data water pump relay:', chartDataWaterPumpRelay);
      console.log('label data water pump relay:', labelDataWaterPumpRelay);

      const currentStateOfWaterPump = chartDataWaterPumpRelay[0];
      if (currentStateOfWaterPump == 1) {
          document.getElementById("textOn").style.display = "block";
          document.getElementById("textOff").style.display = "none";
      }
      else {
          document.getElementById("textOn").style.display = "none";
          document.getElementById("textOff").style.display = "block";
      }
    })
    waterPumpRelayXmlHttpReq.send();
}

const loadSoil = () => {
    const soilXmlHttpReq = new XMLHttpRequest();
    soilXmlHttpReq.open("GET", soilUrl, true);
    soilXmlHttpReq.addEventListener("load", () => {
      const chartDataSoil = [];

      const res = JSON.parse(soilXmlHttpReq.responseText);

      for (let i = 0 ; i < res.length ; i++) {
          try {
            chartDataSoil.push(res[i].value);
          }
          catch (e) {
            console.log(e);
          }
      }

      console.log('chart data soil:', chartDataSoil);

      const currentSoilValue = parseInt(chartDataSoil[0]);
      let currentWaterPumpRelayValue = null;

      document.getElementById("textCurrentSoilValue").style.display = "block";
      document.getElementById("textCurrentSoilValue").innerHTML = currentSoilValue;

      const currentRelayOn = document.getElementById("textOn").style.display;
      const currentRelayOff = document.getElementById("textOff").style.display;

      if (currentRelayOn === "block" && currentRelayOff === "none") {
          currentWaterPumpRelayValue = 1;
      }
      else {
          currentWaterPumpRelayValue = 0;
      }

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
    })
    soilXmlHttpReq.send();
}

const loader = () => {
    loadRelay();
    setTimeout(() => {
        loadSoil();
    }, 1000);
}

const sortStyle = (typeOfSort) => {
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

socket.on("send_data", (element1, element2, element3, element4, element5, element6, element7, element8) => {
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