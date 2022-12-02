const port        = 443;
const host        = "io.adafruit.com";

const username_ada    = "tphiepbk";
const password_ada    = "aio_IudL79ck6I0VNwsGFNJ2jAOc2ame";
const topic = "tphiepbk/feeds/area1-water-pump-relay";

const messageOn = "1";
const messageOff = "0";

const checkboxAutomatic = document.querySelector('input[type="checkbox"]');
checkboxAutomatic.addEventListener('change', () => {
  if (checkboxAutomatic.checked == true) {
    document.getElementById("manual-switch").style.pointerEvents= "none";
    document.getElementById("manual-switch").style.opacity= "0.5";
  }
  else {
    document.getElementById("manual-switch").style.pointerEvents= "auto";
    document.getElementById("manual-switch").style.opacity= "1";
  }
});

// send a message
const turnOn = () => {
    setTimeout(() => {
      console.log('Turn on');
      document.getElementById("textOn").style.display = "block";
      document.getElementById("textOff").style.display = "none";
      client.send(topic, messageOn);
    }, 1000);
}

const turnOff = () => {
    setTimeout(() => {
      console.log('Turn off');
      document.getElementById("textOn").style.display = "none";
      document.getElementById("textOff").style.display = "block";
      client.send(topic, messageOff);
    }, 1000);
}

console.log("Connecting...");
const client = new Paho.MQTT.Client(host, Number(port), "myclientid_" + parseInt(Math.random() * 100, 10));

client.onConnectionLost = (responseObject) => {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
};

client.onMessageArrived = (message) => {
  console.log("onMessageArrived:" + message.payloadString);
}

client.connect({ 
    password : password_ada,
    userName: username_ada,
    onSuccess: () => {
      client.subscribe(topic);
      console.log("Connect successfully");
    }
});

document.getElementById("textOn").style.display = "none";
document.getElementById("textOff").style.display = "none";
document.getElementById("textCurrentSoilValue").style.display = "none";
document.getElementById("textCurrentSoilValue_aggregated").style.display = "none";

const loadRelay = (waterPumpRelayValue) => {
  if (waterPumpRelayValue == 1) {
      document.getElementById("textOn").style.display = "block";
      document.getElementById("textOff").style.display = "none";
  }
  else {
      document.getElementById("textOn").style.display = "none";
      document.getElementById("textOff").style.display = "block";
  }
}

const loadSoil_aggregated = (soilSensorValue) => {
  document.getElementById("textCurrentSoilValue_aggregated").style.display = "block";
  document.getElementById("textCurrentSoilValue_aggregated").innerHTML = soilSensorValue;

  const currentRelayOn = document.getElementById("textOn").style.display;
  const currentRelayOff = document.getElementById("textOff").style.display;

  const currentWaterPumpRelayValue = (currentRelayOn === "block" && currentRelayOff === "none") ? 1 : (currentRelayOn === "none" && currentRelayOff === "block") ? 0 : -1;

  if (checkboxAutomatic.checked == true) {
    if (soilSensorValue >= 100 && currentWaterPumpRelayValue == 1) {
      highSoilAlertTrigger();
      turnOff();
    }
    else if (soilSensorValue < 100 && currentWaterPumpRelayValue == 0) {
      lowSoilAlertTrigger();
      turnOn();
    }
  }
  else {
    if (soilSensorValue >= 100 && currentWaterPumpRelayValue == 1) {
      highSoilAlertTrigger();
    }
    else if (soilSensorValue < 100 && currentWaterPumpRelayValue == 0) {
      lowSoilAlertTrigger();
    }
  }
}

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

const socket = io('http://localhost:3000/', {
    reconnectionDelayMax: 7000
});

socket.on("send_soil_humidity_sensor_latest_aggregate_value", (data) => {
  loadSoil_aggregated(Math.round(data * 100) / 100);
});

socket.on("send_soil_humidity_sensor_latest_value", (data) => {
  document.getElementById("textCurrentSoilValue").style.display = "block";
  document.getElementById("textCurrentSoilValue").innerHTML = data;
});

socket.on("send_water_pump_relay_latest_value", (data) => {
  loadRelay(data);
});

socket.on("send_soil_humidity_sensor_data", (data) => {
  generateDataForTable("tableOfSoilHumiditySensorDeviceData", data)
});

socket.on("send_water_pump_relay_data", (data) => {
  generateDataForTable("tableOfWaterPumpRelayDeviceData", data)
});

lowLightAlertHide();
highLightAlertHide();
lowSoilAlertHide();
highSoilAlertHide();