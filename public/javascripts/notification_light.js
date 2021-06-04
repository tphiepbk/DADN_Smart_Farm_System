var timeOld ;
var timeNew ;
var totalTime = 0;

//var dataUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-light-relay/data.json?X-AIO-Key=aio_vjlb21Jsae7D86XwPisWl5WVvud7"
const dataUrl = "https://io.adafruit.com/api/v2/CSE_BBC1/feeds/bk-iot-relay/data.json?X-AIO-Key=aio_sRyV27Jw7nbPzH7V8GaZ9lFlnK3Y"

function time(ntime, otime){
    var t1 = ntime.getTime();
    var t2 = otime.getTime();
    return parseInt((t1-t2)/(3600*1000))
}
function time_light() {
    var d = new Date();
    totalTime = 0;
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', dataUrl, true);
    req.onload  = function() {
        var jsonResponse = req.response;
        for (var i = 0 ; i < jsonResponse.length - 1; i++) {
            if (parseInt(JSON.parse(jsonResponse[i].value).data) == 1 &&
            parseInt(JSON.parse(jsonResponse[i+1].value).data) == 1 &&
            jsonResponse[i].created_at.getTime() == d.getTime()){
                timeNew = jsonResponse[i].created_at.getTime();
                timeOld = jsonResponse[i].created_at.getTime();
                totalTime += time(dateNew, dateOld);
            }
        }
    };
    req.send();
    return totalTime;
}