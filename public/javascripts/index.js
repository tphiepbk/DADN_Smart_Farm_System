var labeldataSoil = [];
var chartdataSoil = [];

var labeldataLight = [];
var chartdataLight = [];

/*
var lightUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-light/data.json?X-AIO-Key=" + aio_key;
var soilUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-soil/data.json?X-AIO-Key=" + aio_key;
var tempHumidUrl = "https://io.adafruit.com/api/v2/tphiepbk/feeds/bk-iot-temp-humid/data.json?X-AIO-Key=" + aio_key;
*/

// * Final demo
const lightUrl = get_lightUrl();
const soilUrl = get_soilUrl();
const humidUrl = get_humidUrl();
const tempUrl = get_tempUrl();

const intervalTime = 2000;


const insertRowsToTable = (tableInstance, time, deviceId, value) => {
  const row = tableInstance.insertRow(tableInstance.length);
  const cell0 = row.insertCell(0);
  const cell1 = row.insertCell(1);
  const cell2 = row.insertCell(2);

  const textCell0 = document.createTextNode(time);
  cell0.appendChild(textCell0);

  const textCell1 = document.createTextNode(deviceId);
  cell1.appendChild(textCell1);

  const textCell2 = document.createTextNode(value);
  cell2.appendChild(textCell2);
}

const generateDataForTable = (tableName, listDeviceData) => {
  const tableInstance = document.getElementById(tableName);

  while (tableInstance.rows.length > 1) {
    tableInstance.deleteRow(1);
  }

  listDeviceData.map(deviceData => {
    insertRowsToTable(tableInstance, deviceData.time, deviceData.device_id, deviceData.value);
  });
}

const loadSoil = (data) => {
  document.getElementById("text-current-soil-humidity-sensor-value").innerHTML = data;
}

const loadLight = (data) => {
  document.getElementById("text-current-light-sensor-value").innerHTML = data;
}

const loadTemp = (data) => {
  document.getElementById("text-current-temperature-sensor-value").innerHTML = data;
}

const socket = io('http://localhost:3000/', {
  reconnectionDelayMax: 7000
});

socket.on("send_air_humidity_sensor_latest_value", (element) => {
  document.getElementById("text-current-air-humidity-sensor-value").innerHTML = element;
})
socket.on("send_soil_humidity_sensor_latest_value", (element) => {
  document.getElementById("text-current-soil-humidity-sensor-value").innerHTML = element;
})
socket.on("send_light_sensor_latest_value", (element) => {
  document.getElementById("text-current-light-sensor-value").innerHTML = element;
})
socket.on("send_temperature_sensor_latest_value", (element) => {
  document.getElementById("text-current-temperature-sensor-value").innerHTML = element;
})

socket.on("send_air_humidity_sensor_data", (data) => {
  generateDataForTable("tableOfAirHumiditySensorDeviceData", data);
})
socket.on("send_soil_humidity_sensor_data", (data) => {
  generateDataForTable("tableOfSoilHumiditySensorDeviceData", data);
})
socket.on("send_light_sensor_data", (data) => {
  generateDataForTable("tableOfLightSensorDeviceData", data);
})
socket.on("send_temperature_sensor_data", (data) => {
  generateDataForTable("tableOfTemperatureSensorDeviceData", data);
})

lowLightAlertHide();
highLightAlertHide();
lowSoilAlertHide();
highSoilAlertHide();
