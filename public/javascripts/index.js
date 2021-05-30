const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const connectionString = "mongodb+srv://tphiepbk:hiepit-2992@cluster0.axbkf.mongodb.net/bk-iot-test?retryWrites=true&w=majority";

// Use connect method to connect to the Server
function test() {
    MongoClient.connect(connectionString, function(err, client) {
        assert.equal(null, err);

        const db = client.db("bk-iot-test");

        var cursor = db.collection('bk-iot-soil').find({}).sort({"created_at":-1});

        console.log(cursor);

        client.close();
    });
}

test();