const mongoose = require("mongoose");
const {MongoClient} = require("mongodb");
const https = require("https");
const assert = require("assert");

// Connection string
const CONNECTION_STRING = "mongodb+srv://tphiepbk:tph-2992@cluster0.bjhqp.mongodb.net/de-smart-farm?retryWrites=true&w=majority";

const my_aio_key = "aio_Lzjf98yFKjage19nOWPKGJHENd1U";

const soil_humidity_sensor_key = "de-smart-farm.de-smart-farm-soil-humidity-sensor"
const light_sensor_key = "de-smart-farm.de-smart-farm-light-sensor"
const water_pump_relay_key = "de-smart-farm.de-smart-farm-water-pump-relay"
const light_relay_key = "de-smart-farm.de-smart-farm-light-relay"
const air_humidity_sensor_key = "de-smart-farm.de-smart-farm-air-humidity-sensor"
const temperature_sensor_key = "de-smart-farm.de-smart-farm-temperature-sensor"

// ADAFruits devices
const light_relay_url = `https://io.adafruit.com/api/v2/tphiepbk/feeds/${light_relay_key}/data.json?X-AIO-Key=${my_aio_key}`;
const water_pump_relay_url = `https://io.adafruit.com/api/v2/tphiepbk/feeds/${water_pump_relay_key}/data.json?X-AIO-Key=${my_aio_key}`;
const light_url = `https://io.adafruit.com/api/v2/tphiepbk/feeds/${light_sensor_key}/data.json?X-AIO-Key=${my_aio_key}`;
const soil_url = `https://io.adafruit.com/api/v2/tphiepbk/feeds/${soil_humidity_sensor_key}/data.json?X-AIO-Key=${my_aio_key}`;
const temperature_url = `https://io.adafruit.com/api/v2/tphiepbk/feeds/${temperature_sensor_key}/data.json?X-AIO-Key=${my_aio_key}`;
const air_humidity_url = `https://io.adafruit.com/api/v2/tphiepbk/feeds/${air_humidity_sensor_key}/data.json?X-AIO-Key=${my_aio_key}`;

// mongoose.set('autoIndex', false);

// const startConnection = async () => {
//   const connectionPromise = new Promise((resolve, _reject) => {
//     mongoose.connect(CONNECTION_STRING, {autoIndex: false}, (error) => {
//       if (error) {
//         console.log(`error = ${error}`)
//         resolve("FAILED");
//       }
//       else resolve("SUCCESS");
//     });
//   });
//   const result = await connectionPromise;
//   return result;
// };
// 
// const closeConnection = async () => {
//   const result = await mongoose.disconnect();
//   return result;
// };
// 
// const lightSensorSchema = new mongoose.Schema({
//   id: String,
//   value: String,
//   feed_id: Number,
//   feed_key: String,
//   created_at: String,
//   created_epoch: Number,
//   expiration: String
// }, {collection: "light-sensor"});
// 
// const lightSensorModel = mongoose.model('light-sensor', lightSensorSchema)
// 
// const soilHumiditySensorSchema = new mongoose.Schema({
//   id: String,
//   value: String,
//   feed_id: Number,feed_key: String,
//   created_at: String,
//   created_epoch: Number,
//   expiration: String
// }, {collection: "soil-humidity-sensor"});
// 
// const soilHumiditySensorModel = mongoose.model('soil-humidity-sensor', soilHumiditySensorSchema)
// 
// const lightRelaySchema = new mongoose.Schema({
//   id: String,
//   value: String,
//   feed_id: Number,feed_key: String,
//   created_at: String,
//   created_epoch: Number,
//   expiration: String
// }, {collection: "light-relay"});
// 
// const lightRelayModel = mongoose.model('light-relay', lightRelaySchema)
// 
// const waterPumpRelaySchema = new mongoose.Schema({
//   id: String,
//   value: String,
//   feed_id: Number,feed_key: String,
//   created_at: String,
//   created_epoch: Number,
//   expiration: String
// }, {collection: "water-pump-relay"});
// 
// const waterPumpRelayModel = mongoose.model('water-pump-relay', waterPumpRelaySchema)
// 
// const saveDeviceData = async (typeOfDevice, feedData, myResolve) => {
//   let returnValue;
//   let deviceModel;
// 
//   const connectionResult = await startConnection();
// 
//   if (connectionResult === "FAILED") {
//     returnValue = "CANNOT CONNECT";
//   } else {
//     if (typeOfDevice === "light-sensor") {
//       deviceModel = lightSensorModel
//     } else if (typeOfDevice === "soil-humidity-sensor") {
//       deviceModel = soilHumiditySensorModel
//     } else if (typeOfDevice === "light-relay") {
//       deviceModel = lightRelayModel
//     } else {
//       deviceModel = waterPumpRelayModel
//     }
// 
//     const saveDeviceDataPromise = new Promise((resolve, reject) => {
//       deviceModel.insertMany(feedData.map(element => ({...element})), {ordered: false}, (error) => {
//         if (error) {
//           console.log(`Save error: ${error}`)
//           resolve("FAILED TO INSERT")
//         } else {
//           console.log("insert many success");
//           resolve("SUCCESS")
//         }
//       })
//     });
// 
//     returnValue = await saveDeviceDataPromise;
// 
//     await closeConnection();
//   }
// 
//   myResolve(returnValue);
// };

const mongoClient = new MongoClient(CONNECTION_STRING);

const saveDeviceData = async (typeOfDevice, feedData, resolve) => {
  try {
    await mongoClient.connect();
    const database = mongoClient.db("de-smart-farm");
    const collection = database.collection(typeOfDevice);
    collection.createIndex({"id": 1}, {unique: true});
    const options = { ordered: true, upsert: true };
    const result = await collection.insertMany(feedData, options);
    console.log(`${result.insertedCount} documents were inserted`);
  } catch(e) {
    console.log(`================================== ${typeOfDevice} ==========================================`);
    console.log(e);
    console.log(`================================== ${typeOfDevice} ==========================================`);
    resolve("FAILED");
  } finally {
    await mongoClient.close();
    resolve("SUCCESS");
  }
}

const getDataFromDevicesAndUpload = async (typeOfDevice, url, resolve) => {
  https.get(url, (res) => {
    let body = "";

    res.on("data", (chunk) => {
      body += chunk;
    });

    res.on("end", () => {
        try {
            let responseAsJson = JSON.parse(body);
            // do something with JSON
            let feedData = [];
            for (var i = 0 ; i < responseAsJson.length ; i++) {
              feedData.push(responseAsJson[i]);
            }
            saveDeviceData(typeOfDevice, feedData, resolve)
        } catch (error) {
            console.error(error.message);
        };
    });

  }).on("error", (error) => {
      console.error(error.message);
  });

};

const fullLoader = async (onFinish) => {
  console.log("Uploading data from url to MongoDB...");

  const getLightSensorDataPromise = new Promise((resolve, reject) => {
    getDataFromDevicesAndUpload("light-sensor", light_url, resolve);
  })
  const getSoilHumiditySensorPromise = new Promise((resolve, reject) => {
    getDataFromDevicesAndUpload("soil-humidity-sensor", soil_url, resolve);
  })
  const getLightRelayPromise = new Promise((resolve, reject) => {
    getDataFromDevicesAndUpload("light-relay", light_relay_url, resolve);
  })
  const getWaterPumpRelayPromise = new Promise((resolve, reject) => {
    getDataFromDevicesAndUpload("water-pump-relay", water_pump_relay_url, resolve);
  })
  const getTemperatureSensorDataPromise = new Promise((resolve, reject) => {
    getDataFromDevicesAndUpload("temperature-sensor", temperature_url, resolve);
  })
  const getAirHumiditySensorDataPromise = new Promise((resolve, reject) => {
    getDataFromDevicesAndUpload("air-humidity-sensor", air_humidity_url, resolve);
  })

  Promise.all([getLightSensorDataPromise,
    getSoilHumiditySensorPromise,
    getLightRelayPromise,
    getWaterPumpRelayPromise,
    getTemperatureSensorDataPromise,
    getAirHumiditySensorDataPromise
  ]).then((values) => {
    console.log(`Completed uploading data to MongoDB: ${values}`)
    onFinish();
  })
}

module.exports = {
  fullLoader
};
