var labeldataWaterPump = [];
var chartdataWaterPump = [];

var water_pump_chart

var dataUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-water-pump-relay/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7"

/*
$.getJSON('https://io.adafruit.com/api/v2/tphiepbk/feeds/dadn-water-pump/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7', function(data) {
    console.log(data);
    for (var i = 0; i < data.length; i++)
    {
        if (data[i].value === "0" || data[i].value === "1") {
            labeldataWaterPump.push(data[i].created_at);
            chrtdataWaterPump.push(data[i].value)
        }
    }
});
*/

function getData() {
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', dataUrl, true);
    req.onload  = function() {
        var jsonResponse = req.response;
        for (var i = 0 ; i < jsonResponse.length ; i++) {
            labeldataWaterPump.push(jsonResponse[i].created_at);
            chartdataWaterPump.push(JSON.parse(jsonResponse[i].value).data);
        }
    };
    req.send();
}

function createChart() {
    var ctxWaterPump = document.getElementById("water_pump_chart").getContext("2d");
    water_pump_chart = new Chart(ctxWaterPump, {
        type: 'line',
        data: {
        labels: labeldataWaterPump,
            datasets: [{
                label: 'State',
                data: chartdataWaterPump,
                backgroundColor: "rgb(0,192,255)"
            }]
        }
    });
}

function updateChart() {
    water_pump_chart.update();
}

getData();
createChart();

var intervalId = window.setInterval(function(){
    labeldataWaterPump = [];
    chartdataWaterPump = [];

    getData();
    updateChart();
}, 1000);