var labeldataWaterPump = [];
var chartdataWaterPump = [];

var water_pump_chart

var dataUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-water-pump-relay/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7"

const socket = io('http://localhost:3000/', {
    reconnectionDelayMax: 7000
});
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

function getData() {
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', dataUrl, true);
    req.onload  = function() {
        var jsonResponse = req.response;
        for (var i = 0 ; i < jsonResponse.length ; i++) {
            labeldataWaterPump.push(jsonResponse[i].created_at);
            chartdataWaterPump.push(parseInt(JSON.parse(jsonResponse[i].value).data));
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
*/

var ctxWaterPump = document.getElementById("water_pump_chart").getContext("2d");

water_pump_chart = new Chart(ctxWaterPump, {
    type: 'line',
    data: {
    labels: labeldataWaterPump.slice(0,10),
        datasets: [{
            label: 'State',
            data: chartdataWaterPump.slice(0,10),
            backgroundColor: "rgb(0,192,255)"
        }]
    }
});

socket.on('send_data', function(ele1, ele2, ele3, ele4, ele5, ele6, ele7, ele8) {
    chartdataWaterPump  = ele5;
    labeldataWaterPump = ele6;

    console.log('chart data water pump relay:', chartdataWaterPump);
    console.log('label data water pump relay:', labeldataWaterPump);

    water_pump_chart.data.labels = labeldataWaterPump;
    water_pump_chart.data.datasets[0].data = chartdataWaterPump;
    water_pump_chart.update();
});