var labeldataSoil = [];

var chartdataSoil = [];

var soil_chart;

var dataSoilUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-soil/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7"

function getSoilData() {

    console.log('getting data...');

    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', dataSoilUrl, true);
    req.onload  = function() {
        var jsonResponse = req.response;
        for (var i = 0 ; i < jsonResponse.length ; i++) {
            labeldataSoil.push(jsonResponse[i].created_at);
            chartdataSoil.push(parseInt(JSON.parse(jsonResponse[i].value).data));
        }
    };
    req.send();

    console.log(chartdataSoil);
}

function createSoilChart() {
    var ctxSoil = document.getElementById("soil_chart").getContext("2d");

    soil_chart = new Chart(ctxSoil, {
        type: 'line',
        data: {
        labels: labeldataSoil,
            datasets: [{
                label: 'State',
                data: chartdataSoil,
                backgroundColor: "rgb(0,192,255)"
            }]
        }
    });
}

function updateSoilChart() {
    soil_chart.update();
}

getSoilData();
createSoilChart();

var intervalId = window.setInterval(function(){

    labeldataSoil = [];
    chartdataSoil = [];

    getSoilData();
    updateSoilChart();
}, 1000);
