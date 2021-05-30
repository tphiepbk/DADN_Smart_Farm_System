const fetch = require("node-fetch");
const assert = require("assert");

const MongoClient = require("mongodb").MongoClient;

// Connection string
const connectionString = "mongodb+srv://tphiepbk:hiepit-2992@cluster0.axbkf.mongodb.net/bk-iot?retryWrites=true&w=majority";

const soil_url = "https://io.adafruit.com/api/v2/CSE_BBC/feeds/bk-iot-soil/data";
const light_url = "https://io.adafruit.com/api/v2/CSE_BBC1/feeds/bk-iot-light/data";
const light_relay_url = "https://io.adafruit.com/api/v2/CSE_BBC1/feeds/bk-iot-relay/data";
const water_pump_relay_url = "https://io.adafruit.com/api/v2/CSE_BBC1/feeds/bk-iot-relay/data";

function upload(collectionName, data) {
    MongoClient.connect(connectionString, function(err, client) {

        if (err) throw err;
        assert.equal(null, err);

        const db = client.db('bk-iot');

        db.collection(collectionName).createIndex({"id":1}, {unique: true});

        db.collection(collectionName).insert(data)
        .then(function(result) {
            //console.log(result);
        })
        .catch((err) => {
            //console.log(err.message);
        });

        client.close();
    });
};

function getData(collectionName,url) {
    fetch(url)
    .then(data=>{return data.json()})
    .then(res=>{
        feedData = [];
        //console.log(res.length);
        for (var i = 0 ; i < res.length ; i++) {
            feedData.push(res[i]);
        }
        //console.log(feedData);
        upload(collectionName, feedData);
    })
};

setInterval(function(){
    getData('bk-iot-light', light_url);
    getData('bk-iot-soil', soil_url);
    getData('bk-iot-light-relay', light_relay_url);
    getData('bk-iot-water-pump-relay', water_pump_relay_url);
}, 1000);