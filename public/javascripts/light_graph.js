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

function getData() {
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', dataUrl, true);
    req.onload  = function() {
        var jsonResponse = req.response;
        for (var i = 0 ; i < jsonResponse.length ; i++) {
            labeldataLight.push(jsonResponse[i].created_at);
            chartdataLight.push(parseInt(JSON.parse(jsonResponse[i].value).data));
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
*/

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

socket.on('send_data', function(ele1, ele2, ele3, ele4, ele5, ele6, ele7, ele8) {
    chartdataLightRelay  = ele7;
    labeldataLightRelay = ele8;

    console.log('chart data light:', chartdataLightRelay);
    console.log('label data light:', labeldataLightRelay);

    light_chart.data.labels = labeldataLightRelay;
    light_chart.data.datasets[0].data = chartdataLightRelay;
    light_chart.update();
});