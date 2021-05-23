var labeldataLight = [];

var chartdataLight = [];

var light_chart;

var dataLightUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-light/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7"

function getLightData() {

    console.log('getting data...');

    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', dataSoilUrl, true);
    req.onload  = function() {
        var jsonResponse = req.response;
        for (var i = 0 ; i < jsonResponse.length ; i++) {
            labeldataLight.push(jsonResponse[i].created_at);
            chartdataLight.push(JSON.parse(jsonResponse[i].value).data);
        }
    };
    req.send();

    console.log(chartdataLight);
}

function createLightChar() {
    var ctxLight = document.getElementById("light_chart").getContext("2d");

    light_chart = new Chart(ctxLight, {
        type: 'line',
        data: {
        labels: labeldataLight,
            datasets: [{
                label: 'State',
                data: chartdataLight,
                backgroundColor: "rgb(0,192,255)"
            }]
        }
    });
}

function updateLightChart() {
    light_chart.update();
}

getLightData();
createLightChar();

var intervalId = window.setInterval(function(){

    labeldataLight = [];
    chartdataLight = [];

    getLightData();
    updateLightChart();
}, 1000);
