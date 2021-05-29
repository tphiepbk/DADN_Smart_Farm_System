var labeldataLight = [];

var chartdataLight = [];

var light_chart;

var dataUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-light-relay/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7"

/*
$.getJSON('https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-light-relay/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7', function(data) {
    console.log(data);
    for (var i = 0; i < data.length; i++)
    {
        var jsonData = JSON.parse(data[i].value).data;
        console.log(jsonData);
        labeldataLight.push(data[i].created_at);
        chrtdataLight.push(jsonData);
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
            labeldataLight.push(jsonResponse[i].created_at);
            chartdataLight.push(JSON.parse(jsonResponse[i].value).data);
        }
    };
    req.send();
}

function createChart() {
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

function updateChart() {
    light_chart.update();
}

getData();
createChart();

var intervalId = window.setInterval(function(){
    labeldataLight = [];
    chartdataLight = [];

    getData();
    updateChart();
}, 1000);
