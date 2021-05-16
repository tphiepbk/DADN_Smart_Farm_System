var labeldataLight = [];

var chrtdataLight = [];

$.getJSON('https://io.adafruit.com/api/v2/tphiepbk/feeds/dadn-light/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7', function(data) {
    console.log(data);
    for (var i = 0; i < data.length; i++)
    {
        if (data[i].value === "0" || data[i].value === "1") {
            labeldataLight.push(data[i].created_at);
            chrtdataLight.push(data[i].value)
        }
    }
});

var ctxLight = document.getElementById("light_chart").getContext("2d");
var light_chart = new Chart(ctxLight, {
    type: 'line',
    data: {
    labels: labeldataLight,
        datasets: [{
            label: 'State',
            data: chrtdataLight,
            backgroundColor: "rgb(0,192,255)"
        }]
    }
});

function loadLightChart() {
    light_chart.update();
}

loadLightChart();