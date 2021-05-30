const fetch = require("node-fetch");
const assert = require("assert");

const MongoClient = require("mongodb").MongoClient;

// Connection string
const connectionString = "mongodb+srv://tphiepbk:hiepit-2992@cluster0.axbkf.mongodb.net/bk-iot?retryWrites=true&w=majority";

const dataUrl = "https://io.adafruit.com/api/v2/CSE_BBC/feeds/bk-iot-soil/data";

function upload(data) {
    MongoClient.connect(connectionString, function(err, client) {

        if (err) throw err;
        assert.equal(null, err);

        const db = client.db('bk-iot');

        db.collection('bk-iot-soil').createIndex({"id":1}, {unique: true});

        db.collection('bk-iot-soil').insert(data)
        .then(function(result) {
            console.log(result);
        })
        .catch((err) => {
            console.log(err.message);
        });

        client.close();
    });
};


function getData() {
    fetch(dataUrl)
    .then(data=>{return data.json()})
    .then(res=>{
        feedData = [];
        console.log(res.length);
        for (var i = 0 ; i < res.length ; i++) {
            //upload(JSON.parse(res[i].value), 'bk-iot-soil').catch(console.dir);
            feedData.push(res[i]);
        }
        console.log(feedData);
        upload(feedData);
    })
};

setInterval(function(){
    console.log('inserting to mongoDB...');
    getData();
}, 10000);