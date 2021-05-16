var labeldataWaterPump = [];
var chrtdataWaterPump = [];

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

var ctxWaterPump = document.getElementById("water_pump_chart").getContext("2d");
var water_pump_chart = new Chart(ctxWaterPump, {
    type: 'line',
    data: {
    labels: labeldataWaterPump,
        datasets: [{
            label: 'State',
            data: chrtdataWaterPump,
            backgroundColor: "rgb(0,192,255)"
        }]
    }
});

function loadWaterPumpChart() {
    water_pump_chart.update();
}

loadWaterPumpChart();