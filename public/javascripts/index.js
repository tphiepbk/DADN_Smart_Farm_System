var labeldataSoil = [];
var chartdataSoil = [];

var labeldataLight = [];
var chartdataLight = [];

/*
var lightUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-light/data.json?X-AIO-Key=" + aio_key;
var soilUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-soil/data.json?X-AIO-Key=" + aio_key;
var tempHumidUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-temp-humid/data.json?X-AIO-Key=" + aio_key;
*/

// * Final demo
const lightUrl = get_lightUrl();
const soilUrl = get_soilUrl();
const humidUrl = get_humidUrl();
const tempUrl = get_tempUrl();

const intervalTime = 2000;

const ctxSoil = document.getElementById("soil_chart").getContext("2d");
const soil_chart = new Chart(ctxSoil, {
    data: {
        labels: [],
        datasets: [
            {
                type: 'bar',
                label: 'Max',
                data: [],
                backgroundColor: [
                    'rgb(255, 0, 0)'
                ],
                borderColor: [
                    'rgb(255, 0, 0)'
                ],
                borderWidth: 4
            },
            {
                type: 'bar',
                label: 'Average',
                data: [],
                backgroundColor: [
                    'rgb(255, 203, 0)'
                ],
                borderColor: [
                    'rgb(255, 203, 0)'
                ],
                borderWidth: 4
            },
            {
                type: 'bar',
                label: 'Min',
                data: [],
                backgroundColor: [
                    'rgb(60, 179, 113)'
                ],
                borderColor: [
                    'rgb(60, 179, 113)'
                ],
                borderWidth: 4
            },
        ]
    }
});

const ctxLight = document.getElementById("light_chart").getContext("2d");
const light_chart = new Chart(ctxLight, {
    data: {
        labels: [],
        datasets: [
            {
                type: 'bar',
                label: 'Max',
                data: [],
                backgroundColor: [
                    'rgb(255, 0, 0)'
                ],
                borderColor: [
                    'rgb(255, 0, 0)'
                ],
                borderWidth: 4
            },
            {
                type: 'bar',
                label: 'Average',
                data: [],
                backgroundColor: [
                    'rgb(255, 203, 0)'
                ],
                borderColor: [
                    'rgb(255, 203, 0)'
                ],
                borderWidth: 4
            },
            {
                type: 'bar',
                label: 'Min',
                data: [],
                backgroundColor: [
                    'rgb(60, 179, 113)'
                ],
                borderColor: [
                    'rgb(60, 179, 113)'
                ],
                borderWidth: 4
            },
        ]
    }
});

let sortedLightByDay = true;
let sortedLightByMonth = false;
let sortedLightByYear = false;

const loadLightChartData = (chartDataLight, labelDataLight) => {
    console.log('chart data light :', chartDataLight);
    console.log('label data light :', labelDataLight);

    var labelDataLightDate = [];

    var chartDataLightDate_averageValue = [];
    var chartDataLightDate_maxValue = [];
    var chartDataLightDate_minValue = [];
    var chartDataLightDate_latestValue = [];

    var lightValueOfDay = [];

    var sumLightValueOfDay = 0;

    for (let i = 0 ; i < labelDataLight.length ; i++) {

        var currentDate = null;
        if (sortedLightByDay == true) {
            currentDate = labelDataLight[i].substr(0, 10);
        }
        else if (sortedLightByMonth == true) {
            currentDate = labelDataLight[i].substr(0, 7);
        }
        else {
            currentDate = labelDataLight[i].substr(0, 4);
        }

        var currentLightValue = parseInt(chartDataLight[i]);

        if (currentDate != labelDataLightDate[labelDataLightDate.length - 1] && labelDataLightDate.length != 0) {

            chartDataLightDate_averageValue.push(sumLightValueOfDay /= lightValueOfDay.length);
            chartDataLightDate_maxValue.push(Math.max(...lightValueOfDay));
            chartDataLightDate_minValue.push(Math.min(...lightValueOfDay));
            chartDataLightDate_latestValue.push(lightValueOfDay[0]);

            sumLightValueOfDay = 0;
            lightValueOfDay = [];
        }

        sumLightValueOfDay += currentLightValue;
        lightValueOfDay.push(currentLightValue);

        if (labelDataLightDate.length == 0 || labelDataLightDate[labelDataLightDate.length-1] !== currentDate) {
            labelDataLightDate.push(currentDate);
        }
    }
    chartDataLightDate_averageValue.push(sumLightValueOfDay /= lightValueOfDay.length);
    chartDataLightDate_maxValue.push(Math.max(...lightValueOfDay));
    chartDataLightDate_minValue.push(Math.min(...lightValueOfDay));
    chartDataLightDate_latestValue.push(lightValueOfDay[0]);

    console.log('chart data light date avg value:', chartDataLightDate_averageValue);
    console.log('chart data light date max value:', chartDataLightDate_maxValue);
    console.log('chart data light date min value:', chartDataLightDate_minValue);
    console.log('chart data light date latest value:', chartDataLightDate_latestValue);
    console.log('label data light date:', labelDataLightDate);

    if (sortedLightByDay == true) {
        light_chart.data.labels = labelDataLightDate.splice(0, 7);
        light_chart.data.datasets[0].data = chartDataLightDate_maxValue.splice(0, 7);
        light_chart.data.datasets[1].data = chartDataLightDate_averageValue.splice(0, 7);
        light_chart.data.datasets[2].data = chartDataLightDate_minValue.splice(0, 7);
    }
    else if (sortedLightByMonth == true) {
        light_chart.data.labels = labelDataLightDate.splice(0, 12);
        light_chart.data.datasets[0].data = chartDataLightDate_maxValue.splice(0, 12);
        light_chart.data.datasets[1].data = chartDataLightDate_averageValue.splice(0, 12);
        light_chart.data.datasets[2].data = chartDataLightDate_minValue.splice(0, 12);
    }
    else {
        light_chart.data.labels = labelDataLightDate.splice(0, 5);
        light_chart.data.datasets[0].data = chartDataLightDate_maxValue.splice(0, 5);
        light_chart.data.datasets[1].data = chartDataLightDate_averageValue.splice(0, 5);
        light_chart.data.datasets[2].data = chartDataLightDate_minValue.splice(0, 5);
    }

    light_chart.update(); 
}

let sortedSoilByDay = true;
let sortedSoilByMonth = false;
let sortedSoilByYear = false;

const loadSoilChartData = (chartDataSoil, labelDataSoil) => {
    console.log('chart data soil :', chartDataSoil);
    console.log('label data soil :', labelDataSoil);

    var labelDataSoilDate = [];

    var chartDataSoilDate_averageValue = [];
    var chartDataSoilDate_maxValue = [];
    var chartDataSoilDate_minValue = [];
    var chartDataSoilDate_latestValue = [];

    var soilValueOfDay = [];

    var sumSoilValueOfDay = 0;

    for (var i = 0 ; i < labelDataSoil.length ; i++) {

        var currentDate = null;
        if (sortedSoilByDay == true) {
            currentDate = labelDataSoil[i].substr(0, 10);
        }
        else if (sortedSoilByMonth == true) {
            currentDate = labelDataSoil[i].substr(0, 7);
        }
        else {
            currentDate = labelDataSoil[i].substr(0, 4);
        };

        var currentSoilValue = parseInt(chartDataSoil[i]);

        if (currentDate != labelDataSoilDate[labelDataSoilDate.length - 1] && labelDataSoilDate.length != 0) {

            chartDataSoilDate_averageValue.push(sumSoilValueOfDay /= soilValueOfDay.length);
            chartDataSoilDate_maxValue.push(Math.max(...soilValueOfDay));
            chartDataSoilDate_minValue.push(Math.min(...soilValueOfDay));
            chartDataSoilDate_latestValue.push(soilValueOfDay[0]);

            sumSoilValueOfDay = 0;
            soilValueOfDay = [];
        }

        sumSoilValueOfDay += currentSoilValue;
        soilValueOfDay.push(currentSoilValue);

        if (labelDataSoilDate.length == 0 || labelDataSoilDate[labelDataSoilDate.length-1] !== currentDate) {
            labelDataSoilDate.push(currentDate);
        }
    }
    chartDataSoilDate_averageValue.push(sumSoilValueOfDay /= soilValueOfDay.length);
    chartDataSoilDate_maxValue.push(Math.max(...soilValueOfDay));
    chartDataSoilDate_minValue.push(Math.min(...soilValueOfDay));
    chartDataSoilDate_latestValue.push(soilValueOfDay[0]);

    console.log('chart data Soil date avg value:', chartDataSoilDate_averageValue);
    console.log('chart data Soil date max value:', chartDataSoilDate_maxValue);
    console.log('chart data Soil date min value:', chartDataSoilDate_minValue);
    console.log('chart data Soil date latest value:', chartDataSoilDate_latestValue);
    console.log('label data Soil date:', labelDataSoilDate);

    if (sortedSoilByDay == true) {
        soil_chart.data.labels = labelDataSoilDate.slice(0, 7);
        soil_chart.data.datasets[0].data = chartDataSoilDate_maxValue.slice(0, 7);
        soil_chart.data.datasets[1].data = chartDataSoilDate_averageValue.slice(0, 7);
        soil_chart.data.datasets[2].data = chartDataSoilDate_minValue.slice(0, 7);
    }
    else if (sortedLightByMonth == true) {
        soil_chart.data.labels = labelDataSoilDate.slice(0, 12);
        soil_chart.data.datasets[0].data = chartDataSoilDate_maxValue.slice(0, 12);
        soil_chart.data.datasets[1].data = chartDataSoilDate_averageValue.slice(0, 12);
        soil_chart.data.datasets[2].data = chartDataSoilDate_minValue.slice(0, 12);
    }
    else {
        soil_chart.data.labels = labelDataSoilDate.slice(0, 5);
        soil_chart.data.datasets[0].data = chartDataSoilDate_maxValue.slice(0, 5);
        soil_chart.data.datasets[1].data = chartDataSoilDate_averageValue.slice(0, 5);
        soil_chart.data.datasets[2].data = chartDataSoilDate_minValue.slice(0, 5);
    }

    soil_chart.update(); 
}

const loadSoil = () => {
    const soilXmlHttpReq = new XMLHttpRequest();
    soilXmlHttpReq.addEventListener("load", () => {
      const res = JSON.parse(soilXmlHttpReq.responseText);
      document.getElementById("text-current-soil-value").innerHTML = res[0].value;
    })
    soilXmlHttpReq.open("GET", soilUrl, true);
    soilXmlHttpReq.send();
}
const loadLight = () => {
    const lightXmlHttpReq = new XMLHttpRequest();
    lightXmlHttpReq.addEventListener("load", () => {
      const res = JSON.parse(lightXmlHttpReq.responseText);
      document.getElementById("text-current-light-value").innerHTML = res[0].value;
    })
    lightXmlHttpReq.open("GET", lightUrl, true);
    lightXmlHttpReq.send();
}

const loadTemp = () => {
    var tempXmlHttpReq = new XMLHttpRequest();
    tempXmlHttpReq.addEventListener("load", () => {
      const res = JSON.parse(tempXmlHttpReq.responseText);
      document.getElementById("text-current-temp-value").innerHTML = res[0].value;
    })
    tempXmlHttpReq.open("GET", tempUrl, true);
    tempXmlHttpReq.send();
}

const loadHumid = () => {
    var humidXmlHttpReq = new XMLHttpRequest();
    humidXmlHttpReq.addEventListener("load", () => {
      const res = JSON.parse(humidXmlHttpReq.responseText);
      document.getElementById("text-current-humid-value").innerHTML = res[0].value;
    })
    humidXmlHttpReq.open("GET", humidUrl, true);
    humidXmlHttpReq.send();
}

const sortStyle = (type, typeOfSort) => {
  if (type == "light") {
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
  else {
    if (typeOfSort == "day") {
      sortedSoilByDay = true;
      sortedSoilByMonth = false;
      sortedSoilByYear = false;
    }
    else if (typeOfSort == "month") {
      sortedSoilByDay = false;
      sortedSoilByMonth = true;
      sortedSoilByYear = false;
    }
    else {
      sortedSoilByDay = false;
      sortedSoilByMonth = false;
      sortedSoilByYear = true;
    }
  }
}

const socket = io('http://localhost:3000/', {
    reconnectionDelayMax: 7000
});

socket.on("send_data", (element1, element2, element3, element4, element5, element6, element7, element8) => {
    loadLightChartData(element1, element2);
    loadSoilChartData(element3, element4);
});

const loader = () => {
  loadSoil();
  loadLight();
  loadTemp();
  loadHumid();
}

const repeat = setInterval(() => {
  loader();
}, intervalTime);

lowLightAlertHide();
highLightAlertHide();
lowSoilAlertHide();
highSoilAlertHide();

const updateClock = () => {
    const d = new Date();
    document.getElementById("time").innerHTML = d.toLocaleTimeString();
    document.getElementById("date").innerHTML = d.toLocaleDateString("vi-VN");
}

window.setInterval(updateClock, 1000);
