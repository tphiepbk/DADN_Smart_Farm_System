var labeldataSoil = [];

var chartdataSoil = [];

var soil_chart;

var dataUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-soil/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7"

function getData() {
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', dataUrl, true);
    req.onload  = function() {
        var jsonResponse = req.response;
        for (var i = 0 ; i < jsonResponse.length ; i++) {
            labeldataSoil.push(jsonResponse[i].created_at);
            chartdataSoil.push(JSON.parse(jsonResponse[i].value).data);
        }
    };
    req.send();
}

function createChart() {
    var ctxLight = document.getElementById("soil_chart").getContext("2d");

    light_chart = new Chart(ctxLight, {
        type: 'line',
        data: {
        labels: labeldataLight,
            datasets: [{
                label: 'State',
                data: chartdataSoil,
                backgroundColor: "rgb(0,192,255)"
            }]
        }
    });
}

function updateChart() {
    soil_chart.update();
}

getData();
createChart();

var intervalId = window.setInterval(function(){
    labeldataSoil = [];
    chartdataSoil = [];

    getData();
    updateChart();
}, 1000);
