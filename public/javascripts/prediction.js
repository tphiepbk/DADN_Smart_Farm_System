//var tempHumidUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-temp-humid/data.json?X-AIO-Key=" + aio_key;

// * Final demo
const tempUrl = get_tempUrl();
const humidUrl = get_humidUrl();

const intervalTime = 3000;

const reqListenerModel = () => {
  const res = JSON.parse(reqListenerModel.responseText);
  const rainfall = parseFloat(res.result);
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

const loadTempHumid = () => {
  const tempXmlHttpReq = new XMLHttpRequest();
  tempXmlHttpReq.addEventListener("load", () => {
    const res = JSON.parse(tempXmlHttpReq.responseText);

    document.getElementById("textCurrentTempValue").innerHTML = res[0].value
    // document.getElementById("textCurrentHumidValue").innerHTML = humid;

    const obj = new Object();
    obj.author = "tphiepbk";
    obj.type  = "LinearRegression";
    obj.input = res[0].value;
    const jsonString= JSON.stringify(obj);

    const modelURL = "http://127.0.0.1:5000/linear_regression";
    const modelXmlHttpReq = new XMLHttpRequest();
    modelXmlHttpReq.addEventListener("load", () => {
      const res = JSON.parse(modelXmlHttpReq.responseText);
      let rainfall = parseFloat(res.result);
      rainfall = Math.round((rainfall + Number.EPSILON) * 100) / 100;
      console.log(rainfall);
      document.getElementById("predictedRainfall").innerHTML = rainfall.toString();
    })
    modelXmlHttpReq.open("POST", modelURL, true);
    modelXmlHttpReq.send(jsonString);
  })
  tempXmlHttpReq.open("GET", tempUrl, true);
  tempXmlHttpReq.send();

  const humidXmlHttpReq = new XMLHttpRequest();
  humidXmlHttpReq.addEventListener("load", () => {
    const res = JSON.parse(humidXmlHttpReq.responseText);
    document.getElementById("textCurrentHumidValue").innerHTML = res[0].value
  })
  humidXmlHttpReq.open("GET", humidUrl, true);
  humidXmlHttpReq.send();
}

const insertRowsToTable = (date_str, avgtemp_str, rainfall_str) => {
    const table = document.getElementById("tableOfPrediction");
    let duplicate = false;

    for (let i = 1, row; row = table.rows[i]; i++) {
        const cellContent = row.cells[0].innerHTML;

        if (cellContent === date_str) {
            duplicate = true;
        }
    }

    if (duplicate == false) {
        const row = table.insertRow(table.length);
        const cell0 = row.insertCell(0);
        const cell1 = row.insertCell(1);
        const cell2 = row.insertCell(2);

        const textCell0 = document.createTextNode(date_str);
        cell0.appendChild(textCell0);

        const textCell1 = document.createTextNode(avgtemp_str);
        cell1.appendChild(textCell1);

        const textCell2 = document.createTextNode(rainfall_str);
        cell2.appendChild(textCell2);
    }
}

// function reqListenerForecast() {
//     var res = JSON.parse(this.responseText);
// 
//     var predictionsStr_rainfall = res.rainfall;
//     var predictionsStr_avgtemp = res.avgtemp;
// 
//     var yearOfPrediction = res.year;
// 
//     var predictedRainfall_arr = predictionsStr_rainfall.split(",");
//     predictedRainfall_arr.pop();
// 
//     var predictedAvgTemp_arr = predictionsStr_avgtemp.split(",");
//     predictedAvgTemp_arr.pop();
// 
//     console.log(predictedRainfall_arr);
//     console.log(predictedAvgTemp_arr);
// 
//     for (var i = 0 ; i < predictedAvgTemp_arr.length ; i++) {
// 
//         var rainfall = parseFloat(predictedRainfall_arr[i]);
//         rainfall = Math.round((rainfall + Number.EPSILON) * 100) / 100;
// 
//         var avgtemp = parseFloat(predictedAvgTemp_arr[i]);
//         avgtemp = Math.round((avgtemp + Number.EPSILON) * 100) / 100;
// 
//         insertRowsToTable((i+1%12).toString()+ '/' + yearOfPrediction.toString(), avgtemp.toString(), rainfall.toString());
//     }
// }

const loadForecast = () => {
    const d = new Date();

    const obj = new Object();
    obj.author = "tphiepbk";
    obj.type  = "ARIMA";
    obj.input = d.getFullYear();
    const jsonString= JSON.stringify(obj);

    const arimaUrl = "http://127.0.0.1:5000/arima";

    const forecastXmlHttpReq = new XMLHttpRequest();

    forecastXmlHttpReq.addEventListener("load", () => {
      const res = JSON.parse(forecastXmlHttpReq.responseText);

      const predictionsStr_rainfall = res.rainfall;
      const predictionsStr_avgtemp = res.avgtemp;

      const yearOfPrediction = res.year;

      const predictedRainfall_arr = predictionsStr_rainfall.split(",");
      predictedRainfall_arr.pop();

      const predictedAvgTemp_arr = predictionsStr_avgtemp.split(",");
      predictedAvgTemp_arr.pop();

      console.log(predictedRainfall_arr);
      console.log(predictedAvgTemp_arr);

      for (let i = 0 ; i < predictedAvgTemp_arr.length ; i++) {

          let rainfall = parseFloat(predictedRainfall_arr[i]);
          rainfall = Math.round((rainfall + Number.EPSILON) * 100) / 100;

          let avgtemp = parseFloat(predictedAvgTemp_arr[i]);
          avgtemp = Math.round((avgtemp + Number.EPSILON) * 100) / 100;

          insertRowsToTable((i+1%12).toString()+ '/' + yearOfPrediction.toString(), avgtemp.toString(), rainfall.toString());
      }
    })
    forecastXmlHttpReq.open("POST", arimaUrl, true);
    forecastXmlHttpReq.send(jsonString);
}

const repeat = setInterval(() => {
  loadTempHumid();
}, intervalTime);