const aio_key = getAIOKey();
var tempHumidUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-temp-humid/data.json?X-AIO-Key=" + aio_key;

var repeat = null;
var intervalTime = 3000;

function reqListenerModel() {
    var res = JSON.parse(this.responseText);
    var rainfall = parseFloat(res.result);
    rainfall = Math.round((rainfall + Number.EPSILON) * 100) / 100;
    console.log(rainfall);
    document.getElementById("predictedRainfall").innerHTML = rainfall.toString();
}

/*
function proceedSoilData () {

    var value = parseInt(document.getElementById('soil_value').value);
    console.log(value);

    var obj = new Object();
    obj.author = "tphiepbk";
    obj.type  = "LinearRegression";
    obj.input = value;
    var jsonString= JSON.stringify(obj);

    const modelURL = "http://127.0.0.1:5000/model";
    var modelXmlHttpReq = new XMLHttpRequest();
    modelXmlHttpReq.onload = reqListenerModel;
    modelXmlHttpReq.open("POST", modelURL, true);
    modelXmlHttpReq.send(jsonString);
}
*/

function reqListenerTempHumid() {
    var res = JSON.parse(this.responseText);
    var tempHumid = JSON.parse(res[0].value).data;

    var temp = tempHumid.substr(0, tempHumid.indexOf('-'))
    var humid = tempHumid.substr(tempHumid.indexOf('-') + 1, tempHumid.length)

    document.getElementById("textCurrentTempValue").innerHTML = temp;
    document.getElementById("textCurrentHumidValue").innerHTML = humid;

    var obj = new Object();
    obj.author = "tphiepbk";
    obj.type  = "LinearRegression";
    obj.input = temp;
    var jsonString= JSON.stringify(obj);

    const modelURL = "http://127.0.0.1:5000/model";
    var modelXmlHttpReq = new XMLHttpRequest();
    modelXmlHttpReq.onload = reqListenerModel;
    modelXmlHttpReq.open("POST", modelURL, true);
    modelXmlHttpReq.send(jsonString);
}

function loadTempHumid() {
    var tempHumidXmlHttpReq = new XMLHttpRequest();
    tempHumidXmlHttpReq.onload = reqListenerTempHumid;
    tempHumidXmlHttpReq.open("GET", tempHumidUrl, true);
    tempHumidXmlHttpReq.send();
}

repeat = setInterval(() => {
    loadTempHumid();
}, intervalTime);