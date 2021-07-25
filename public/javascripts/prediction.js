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

    const modelURL = "http://127.0.0.1:5000/linear_regression";
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

function insertRowsToTable(date_str, avgtemp_str, rainfall_str) {
    var table = document.getElementById("tableOfPrediction");
    var duplicate = false;


    for (var i = 1, row; row = table.rows[i]; i++) {
        var cellContent = row.cells[0].innerHTML;

        if (cellContent == date_str) {
            duplicate = true;
        }
    }

    if (duplicate == false) {
        var row = table.insertRow(table.length);
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        
        var textCell0 = document.createTextNode(date_str);
        cell0.appendChild(textCell0);

        var textCell1 = document.createTextNode(avgtemp_str);
        cell1.appendChild(textCell1);

        var textCell2 = document.createTextNode(rainfall_str);
        cell2.appendChild(textCell2);
    }
}

function reqListenerForecast() {
    var res = JSON.parse(this.responseText);

    var predictionsStr_rainfall = res.rainfall;
    var predictionsStr_avgtemp = res.avgtemp;

    var yearOfPrediction = res.year;

    var predictedRainfall_arr = predictionsStr_rainfall.split(",");
    predictedRainfall_arr.pop();

    var predictedAvgTemp_arr = predictionsStr_avgtemp.split(",");
    predictedAvgTemp_arr.pop();

    console.log(predictedRainfall_arr);
    console.log(predictedAvgTemp_arr);

    for (var i = 0 ; i < predictedAvgTemp_arr.length ; i++) {

        var rainfall = parseFloat(predictedRainfall_arr[i]);
        rainfall = Math.round((rainfall + Number.EPSILON) * 100) / 100;

        var avgtemp = parseFloat(predictedAvgTemp_arr[i]);
        avgtemp = Math.round((avgtemp + Number.EPSILON) * 100) / 100;

        insertRowsToTable((i+1%12).toString()+ '/' + yearOfPrediction.toString(), avgtemp.toString(), rainfall.toString());
    }
}

function loadForecast() {

    const d = new Date();

    var obj = new Object();
    obj.author = "tphiepbk";
    obj.type  = "ARIMA";
    obj.input = d.getFullYear();
    var jsonString= JSON.stringify(obj);

    const arimaUrl = "http://127.0.0.1:5000/arima";
    var modelXmlHttpReq = new XMLHttpRequest();
    modelXmlHttpReq.onload = reqListenerForecast;
    modelXmlHttpReq.open("POST", arimaUrl, true);
    modelXmlHttpReq.send(jsonString);
}

repeat = setInterval(() => {
    loadTempHumid();
}, intervalTime);