const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const fetch = require('node-fetch');

// * Test psql
const POSTGRES = require("./db/postgres");

const app = express();
const port = process.env.PORT || 3000;

const server = require("http").createServer(app);
const io = require("socket.io")(server);

const staticpath = path.join(__dirname, "./public");
const templatepath = path.join(__dirname, "./views");
const imagepath = path.join(__dirname, "./public/images");
const scriptpath = path.join(__dirname, "./public/javascripts");

// Middleware
app.use(express.static('public'));
app.use(express.static(staticpath));
app.use(express.static(imagepath));
app.use(express.static(scriptpath));
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true})); 

app.set("view engine", "ejs");
app.set("views", templatepath);

// Express body parser
app.use(express.urlencoded({ extended: true }));

var cors = require('cors')
app.use(cors())

// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/index.js'));

// * DEFINE NEEDDED INFORMATION FOR FETCHING DATA FROM ADAFRUIT
const USERNAME_AREA1 = "tphiepbk";
const AIO_KEY_AREA1 = "aio_IudL79ck6I0VNwsGFNJ2jAOc2ame";
const AREA1_DEVICES = {
  air_humidity_sensor:  "area1-air-humidity-sensor",
  temperature_sensor:   "area1-temperature-sensor",
  light_sensor:         "area1-light-sensor",
  soil_humidity_sensor: "area1-soil-humidity-sensor",
  fog_machine_relay:    "area1-fog-machine-relay",
  cooler_relay:         "area1-cooler-relay",
  light_relay:          "area1-light-relay",
  water_pump_relay:     "area1-water-pump-relay",
};
const AREA1_URLS = Object.entries(AREA1_DEVICES).map(([key, value]) => {
  const splitted = key.split("_");
  const deviceType = splitted[splitted.length - 1];
  const deviceName = key.slice(0, key.length - deviceType.length - 1);
  return {
    area: 1,
    deviceName,
    deviceType,
    url: `https://io.adafruit.com/api/v2/${USERNAME_AREA1}/feeds/${value}/data.json?X-AIO-Key=${AIO_KEY_AREA1}`
  }
})

const USERNAME_AREA2 = "hiep_phuc_thai";
const AIO_KEY_AREA2 = "aio_vhsU29M4gf0ol6DWYLcMdW0vyqHt";
const AREA2_DEVICES = {
  air_humidity_sensor:  "area2-air-humidity-sensor",
  temperature_sensor:   "area2-temperature-sensor",
  light_sensor:         "area2-light-sensor",
  soil_humidity_sensor: "area2-soil-humidity-sensor",
  fog_machine_relay:    "area2-fog-machine-relay",
  cooler_relay:         "area2-cooler-relay",
  light_relay:          "area2-light-relay",
  water_pump_relay:     "area2-water-pump-relay",
};
const AREA2_URLS = Object.entries(AREA2_DEVICES).map(([key, value]) => {
  const splitted = key.split("_");
  const deviceType = splitted[splitted.length - 1];
  const deviceName = key.slice(0, key.length - deviceType.length - 1);
  return {
    area: 2,
    deviceName,
    deviceType,
    url: `https://io.adafruit.com/api/v2/${USERNAME_AREA2}/feeds/${value}/data.json?X-AIO-Key=${AIO_KEY_AREA2}`
  }
})

const USERNAME_AREA3 = "hiep_thai";
const AIO_KEY_AREA3 = "aio_Usbp45Ks4fz3o6kelQKDNtwppjPE";
const AREA3_DEVICES = {
  air_humidity_sensor:  "area3-air-humidity-sensor",
  temperature_sensor:   "area3-temperature-sensor",
  light_sensor:         "area3-light-sensor",
  soil_humidity_sensor: "area3-soil-humidity-sensor",
  fog_machine_relay:    "area3-fog-machine-relay",
  cooler_relay:         "area3-cooler-relay",
  light_relay:          "area3-light-relay",
  water_pump_relay:     "area3-water-pump-relay",
};
const AREA3_URLS = Object.entries(AREA3_DEVICES).map(([key, value]) => {
  const splitted = key.split("_");
  const deviceType = splitted[splitted.length - 1];
  const deviceName = key.slice(0, key.length - deviceType.length - 1);
  return {
    area: 3,
    deviceName,
    deviceType,
    url: `https://io.adafruit.com/api/v2/${USERNAME_AREA3}/feeds/${value}/data.json?X-AIO-Key=${AIO_KEY_AREA3}`
  }
})

const fetchDeviceDataOfArea = async (area, callbackFn) => {
  console.log(`Fetching data of area ${area}`);
  const area_urls = area === 1 ? AREA1_URLS : area === 2 ? AREA2_URLS : AREA3_URLS;

  Object.values(area_urls).forEach(element => {
    fetch(element.url)
    .then(res => Promise.all([res.status, res.json()]))
    .then(([status, jsonData]) => {
      if (status === 200) {
        callbackFn(area, element.deviceName, element.deviceType, jsonData);
      }
    })
  });
}

const INTERVAL_TIME = 5000;

const saveDataToPostgres = async (area, deviceName, deviceType, loadedData) => {
  const deviceId = await POSTGRES.getDeviceId(deviceName, deviceType, area);
  await POSTGRES.saveDeviceData (deviceId, loadedData, (result) => {
    if (result === "SUCCESS") {
      console.log("Insert data successfully");
    } else {
      console.log("Insert data failed");
    }
  });
}

setInterval(() => {
  fetchDeviceDataOfArea(1, saveDataToPostgres);
}, INTERVAL_TIME);

setInterval(() => {
  fetchDeviceDataOfArea(2, saveDataToPostgres);
}, INTERVAL_TIME);

setInterval(() => {
  fetchDeviceDataOfArea(3, saveDataToPostgres);
}, INTERVAL_TIME);

// * SEND DATA TO CLIENT
io.on("connection", async (socket) => {
  const AREA = 1;
  const NUMBER_OF_DATA_RECORD_TO_DISPLAY = 10;
  console.log("Connected to SocketIO successfully");

  // * SEND AIR HUMIDITY SENSOR
  const airHumiditySensorId = await POSTGRES.getDeviceId("air_humidity", "sensor", AREA);

  setInterval(() => {
    POSTGRES.getLatestValueOfDevice(airHumiditySensorId, (result) => {
      if (result !== "FAILED") {
        socket.emit("send_air_humidity_sensor_latest_value", result.value);
      }
    });
  }, INTERVAL_TIME);

  setInterval(() => {
    POSTGRES.getNLatestDataOfDevice(NUMBER_OF_DATA_RECORD_TO_DISPLAY, airHumiditySensorId, (result) => {
      if (result !== "FAILED") {
        socket.emit("send_air_humidity_sensor_data", result);
      }
    })
  }, INTERVAL_TIME);

  setInterval(() => {
    POSTGRES.getLatestAggregateValueOfDevice(airHumiditySensorId, (result) => {
      if (result !== "FAILED") {
        socket.emit("send_air_humidity_sensor_latest_aggregate_value", result);
      }
    })
  }, INTERVAL_TIME);

  // * SEND SOIL HUMIDITY SENSOR
  const soilHumiditySensorId = await POSTGRES.getDeviceId("soil_humidity", "sensor", AREA);

  setInterval(() => {
    POSTGRES.getLatestValueOfDevice(soilHumiditySensorId, (result) => {
      if (result !== "FAILED") {
        socket.emit("send_soil_humidity_sensor_latest_value", result.value);
      }
    });
  }, INTERVAL_TIME);

  setInterval(() => {
    POSTGRES.getNLatestDataOfDevice(NUMBER_OF_DATA_RECORD_TO_DISPLAY, soilHumiditySensorId, (result) => {
      if (result !== "FAILED") {
        socket.emit("send_soil_humidity_sensor_data", result);
      }
    })
  }, INTERVAL_TIME);

  setInterval(() => {
    POSTGRES.getLatestAggregateValueOfDevice(soilHumiditySensorId, (result) => {
      if (result !== "FAILED") {
        socket.emit("send_soil_humidity_sensor_latest_aggregate_value", result);
      }
    })
  }, INTERVAL_TIME);

  // * SEND LIGHT SENSOR
  const lightSensorId = await POSTGRES.getDeviceId("light", "sensor", AREA);

  setInterval(() => {
    POSTGRES.getLatestValueOfDevice(lightSensorId, (result) => {
      if (result !== "FAILED") {
        socket.emit("send_light_sensor_latest_value", result.value);
      }
    });
  }, INTERVAL_TIME);

  setInterval(() => {
    POSTGRES.getNLatestDataOfDevice(NUMBER_OF_DATA_RECORD_TO_DISPLAY, lightSensorId, (result) => {
      if (result !== "FAILED") {
        socket.emit("send_light_sensor_data", result);
      }
    })
  }, INTERVAL_TIME);

  setInterval(() => {
    POSTGRES.getLatestAggregateValueOfDevice(lightSensorId, (result) => {
      if (result !== "FAILED") {
        socket.emit("send_light_sensor_latest_aggregate_value", result);
      }
    })
  }, INTERVAL_TIME);

  // * SEND TEMPERATURE SENSOR
  const temperatureSensorId = await POSTGRES.getDeviceId("temperature", "sensor", AREA);

  setInterval(() => {
    POSTGRES.getLatestValueOfDevice(temperatureSensorId, (result) => {
      if (result !== "FAILED") {
        socket.emit("send_temperature_sensor_latest_value", result.value);
      }
    });
  }, INTERVAL_TIME);

  setInterval(() => {
    POSTGRES.getNLatestDataOfDevice(NUMBER_OF_DATA_RECORD_TO_DISPLAY, temperatureSensorId, (result) => {
      if (result !== "FAILED") {
        socket.emit("send_temperature_sensor_data", result);
      }
    })
  }, INTERVAL_TIME);

  setInterval(() => {
    POSTGRES.getLatestAggregateValueOfDevice(temperatureSensorId, (result) => {
      if (result !== "FAILED") {
        socket.emit("send_temperature_sensor_latest_aggregate_value", result);
      }
    })
  }, INTERVAL_TIME);

  // * SEND LIGHT RELAY
  const lightRelayId = await POSTGRES.getDeviceId("light", "relay", AREA);

  setInterval(() => {
    POSTGRES.getLatestValueOfDevice(lightRelayId, (result) => {
      if (result !== "FAILED") {
        socket.emit("send_light_relay_latest_value", result.value);
      }
    });
  }, INTERVAL_TIME);

  setInterval(() => {
    POSTGRES.getNLatestDataOfDevice(NUMBER_OF_DATA_RECORD_TO_DISPLAY, lightRelayId, (result) => {
      if (result !== "FAILED") {
        socket.emit("send_light_relay_data", result);
      }
    })
  }, INTERVAL_TIME);

  // * SEND WATER PUMP RELAY
  const waterPumpRelayId = await POSTGRES.getDeviceId("water_pump", "relay", AREA);

  setInterval(() => {
    POSTGRES.getLatestValueOfDevice(waterPumpRelayId, (result) => {
      if (result !== "FAILED") {
        socket.emit("send_water_pump_relay_latest_value", result.value);
      }
    });
  }, INTERVAL_TIME);

  setInterval(() => {
    POSTGRES.getNLatestDataOfDevice(NUMBER_OF_DATA_RECORD_TO_DISPLAY, waterPumpRelayId, (result) => {
      if (result !== "FAILED") {
        socket.emit("send_water_pump_relay_data", result);
      }
    })
  }, INTERVAL_TIME);
});

server.listen(port, () =>{
  console.log('Server is running at port ' + port);
});

// ! Prevent app crash
process.on('uncaughtException', (error, origin) => {
    console.log('----- Uncaught exception -----')
    console.log(error)
    console.log('----- Exception origin -----')
    console.log(origin)
})

process.on('unhandledRejection', (reason, promise) => {
    console.log('----- Unhandled Rejection at -----')
    console.log(promise)
    console.log('----- Reason -----')
    console.log(reason)
})
