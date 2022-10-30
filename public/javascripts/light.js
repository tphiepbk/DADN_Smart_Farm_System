const port = 443;
const host = "io.adafruit.com";

const username_ada = "tphiepbk";
const password_ada = "aio_Lzjf98yFKjage19nOWPKGJHENd1U";
const topic = "tphiepbk/feeds/de-smart-farm.de-smart-farm-light-relay";

const messageOn = "1";
const messageOff = "0";

const lightUrl = get_lightUrl();
const relayUrl = get_lightRelayUrl();

const intervalTime = 3000;
let repeat = null;

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
};

client.connect({
  password: password_ada,
  userName: username_ada,
  onSuccess: () => {
    client.subscribe(topic);
    console.log("Connect successfully");
    loader();
  }
});

document.getElementById("textOn").style.display = "none";
document.getElementById("textOff").style.display = "none";
document.getElementById("textCurrentLightValue").style.display = "none";

const calculateDuration = (timestampA, timestampB) => {
    const datetimeA = new Date(timestampA);
    const datetimeB = new Date(timestampB);

    const ms = moment.utc(datetimeB).diff(moment.utc(datetimeA));
    const d = moment.duration(ms);

    return d.asHours();
}

// * For light chart
const ctxLight = document.getElementById("light_chart").getContext("2d");

const light_chart = new Chart(ctxLight, {
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

const sortedLightByDay = true;
const sortedLightByMonth = false;
const sortedLightByYear = false;

const loadChartData = (chartDataLightRelay, labelDataLightRelay) => {
    const labelDataLightRelayDate = [];
    const numberOfLightOn = [];
    const numberOfLightOff = [];

    let currentNumberLightOn = 0;
    let currentNumberLightOff = 0;

    for (let i = 0 ; i < labelDataLightRelay.length ; i++) {

        let currentDate = null;
        if (sortedLightByDay == true) {
            currentDate = labelDataLightRelay[i].substr(0, 10);
        }
        else if (sortedLightByMonth == true) {
            currentDate = labelDataLightRelay[i].substr(0, 7);
        }
        else {
            currentDate = labelDataLightRelay[i].substr(0, 4);
        }

        const currentStateOfSwitch = parseInt(chartDataLightRelay[i]);

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
    let currentDate_labelDataLightRelay_workingHours = [];
    let currentDate_chartDataLightRelay_workingHours = [];

    const labelDataLightRelay_workingHours = [];
    const chartDataLightRelay_workingHours = [];

    let dateIndex = 0;

    for (let i = 0 ; i < labelDataLightRelay.length ; i++) {

        if (currentDate_labelDataLightRelay_workingHours.length == 0) {
            currentDate_chartDataLightRelay_workingHours.push(chartDataLightRelay[i]);
            currentDate_labelDataLightRelay_workingHours.push(labelDataLightRelay[i]);
        }
        else {
            let currentDate = null;
            let previousDate = null;

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

                    let slow = 0;
                    let currentDate_totalWorkingHours = 0;
                    while (slow < currentDate_chartDataLightRelay_workingHours.length) {
                        let found = false;
                        if (currentDate_chartDataLightRelay_workingHours[slow] == "1") {
                            let fast = slow + 1;
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
                                    const endOfTheDate = previousDate + "T23:59:59Z";
                                }
                                else if (sortedLightByMonth == true) {
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
                let startOfTheDate;
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
                        startOfTheDate = previousDate + "T00:00:00Z";
                    }
                    else if (sortedLightByMonth == true) {
                        startOfTheDate = previousDate + "-01T00:00:00Z";
                    }
                    else {
                        startOfTheDate = previousDate + "-01-01T00:00:00Z";
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

                let slow = 0;
                let currentDate_totalWorkingHours = 0;
                while (slow < currentDate_chartDataLightRelay_workingHours.length) {
                    let found = false;
                    if (currentDate_chartDataLightRelay_workingHours[slow] == "1") {
                        let fast = slow + 1;
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
                            let endOfTheDate = null;
                            if (sortedLightByDay == true) {
                                endOfTheDate = previousDate + "T23:59:59Z";
                            }
                            else if (sortedLightByMonth == true) {
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

// const reqListenerRelay = () => {
    // const chartDataLightRelay = [];
    // const labelDataLightRelay = [];

    // console.log(this.responseText)

    // const res = JSON.parse(this.responseText);

    // for (const i = 0 ; i < res.length ; i++) {
        // try {
            // //chartDataLightRelay.push(JSON.parse(res[i].value).data);
            // chartDataLightRelay.push(res[i].value);
        // }
        // catch(e) {

        // }
        // labelDataLightRelay.push(res[i].created_at);
    // }

    // console.log('chart data light relay:', chartDataLightRelay);
    // console.log('label data light relay:', labelDataLightRelay);

    // const currentStateOfLight = chartDataLightRelay[0];
    // if (currentStateOfLight == 1) {
        // document.getElementById("textOn").style.display = "block";
        // document.getElementById("textOff").style.display = "none";
    // }
    // else {
        // document.getElementById("textOn").style.display = "none";
        // document.getElementById("textOff").style.display = "block";
    // }
// }

// const reqListenerLight = () => {
    // const chartDataLight = [];

    // const res = JSON.parse(this.responseText);

    // for (const i = 0 ; i < res.length ; i++) {
        // try {
            // // chartDataLight.push(JSON.parse(res[i].value).data);
            // chartDataLight.push(res[i].value);
        // }
        // catch(e) {

        // }
    // }

    // console.log('chart data light:', chartDataLight);

    // const currentLightValue = parseInt(chartDataLight[0]);
    // const currentLightRelayValue = null;

    // document.getElementById("textCurrentLightValue").style.display = "block";
    // document.getElementById("textCurrentLightValue").innerHTML = currentLightValue;

    // const currentRelayOn = document.getElementById("textOn").style.display;
    // const currentRelayOff = document.getElementById("textOff").style.display;

    // if (currentRelayOn === "block" && currentRelayOff === "none") {
        // currentLightRelayValue = 1;
    // }
    // else {
        // currentLightRelayValue = 0;
    // }

    // if (checkboxAutomatic.checked == true) {
        // if (currentLightValue >= 100 && currentLightRelayValue == 1) {
            // highLightAlertTrigger();
            // turnOff();
        // }
        // else if (currentLightValue < 100 && currentLightRelayValue == 0) {
            // lowLightAlertTrigger();
            // turnOn();
        // }
    // }
    // else {
        // if (currentLightValue >= 100 && currentLightRelayValue == 1) {
            // highLightAlertTrigger();
        // }
        // else if (currentLightValue < 100 && currentLightRelayValue == 0) {
            // lowLightAlertTrigger();
        // }
    // }
// }

const loadRelay = () => {
  const lightRelayXmlHttpReq = new XMLHttpRequest();
  lightRelayXmlHttpReq.open("GET", relayUrl, true);
  lightRelayXmlHttpReq.addEventListener("load", () => {
    const chartDataLightRelay = [];
    const labelDataLightRelay = [];

    const res = JSON.parse(lightRelayXmlHttpReq.responseText);

    console.log(res);

    for (let i = 0 ; i < res.length ; i++) {
      try {
        chartDataLightRelay.push(res[i].value);
      }
      catch(e) {
        console.log(e)
      }
      labelDataLightRelay.push(res[i].created_at);
    }

    console.log('chart data light relay:', chartDataLightRelay);
    console.log('label data light relay:', labelDataLightRelay);

    const currentStateOfLight = chartDataLightRelay[0];
    if (currentStateOfLight == 1) {
        document.getElementById("textOn").style.display = "block";
        document.getElementById("textOff").style.display = "none";
    }
    else {
        document.getElementById("textOn").style.display = "none";
        document.getElementById("textOff").style.display = "block";
    }
  });
  lightRelayXmlHttpReq.send(null);
}

const loadLight = () => {
    const lightXmlHttpReq = new XMLHttpRequest();
    lightXmlHttpReq.open("GET", lightUrl, true);
    lightXmlHttpReq.addEventListener("load", () => {
      const chartDataLight = [];

      const res = JSON.parse(lightXmlHttpReq.responseText);

      for (let i = 0 ; i < res.length ; i++) {
          try {
              chartDataLight.push(res[i].value);
          }
          catch(e) {
            console.log(e);
          }
      }

      console.log('chart data light:', chartDataLight);

      const currentLightValue = parseInt(chartDataLight[0]);
      let currentLightRelayValue = null;

      document.getElementById("textCurrentLightValue").style.display = "block";
      document.getElementById("textCurrentLightValue").innerHTML = currentLightValue;

      const currentRelayOn = document.getElementById("textOn").style.display;
      const currentRelayOff = document.getElementById("textOff").style.display;

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
    })
    lightXmlHttpReq.send(null);
}

const loader = () => {
    loadRelay();
    setTimeout(() => {
        loadLight();
    }, 1000);
}

const sortStyle = (typeOfSort) => {
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

const socket = io('http://localhost:3000/', {
    reconnectionDelayMax: 7000
});

socket.on("send_data", (element1, element2, element3, element4, element5, element6, element7, element8) => {
    /*
    console.log("Received : ");
    console.log(element1);
    console.log(element2);
    */
    loadChartData(element5, element6);
});

repeat = setInterval(() => {
    loader();
    //loadRelay();
    //loadLight();
}, intervalTime);

lowLightAlertHide();
highLightAlertHide();
lowSoilAlertHide();
highSoilAlertHide();