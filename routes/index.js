const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const connectionString = "mongodb+srv://tphiepbk:hiepit-2992@cluster0.axbkf.mongodb.net/bk-iot-test?retryWrites=true&w=majority";

/*
router.get('/', function(req, res) {
    res.render('index', {data: null, created_at: null});
});
*/

router.get('/', function(req, res) {
    /*
    console.log('getting data..');

    var created_at = [];
    var data = [];

    MongoClient.connect(connectionString, function(err, client) {
        assert.equal(null, err);

        const db = client.db("bk-iot-test");

        var cursor = db.collection('bk-iot-soil').find().sort({"created_at":-1});

        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            console.log(doc.value);

            created_at.push(doc.created_at);
            data.push(JSON.parse(doc.value).data);

        }, function() {
            client.close();
            console.log(created_at);
            console.log(data);
            res.render('index', {
                data: data,
                created_at: created_at
            });
        });
    });
    */
    res.render('index');

    /*
    setInterval(function() {
        console.log('hello');
    }, 1000);
    */
});

function getData() {
    console.log('getting data..');

    var created_at = [];
    var data = [];

    MongoClient.connect(connectionString, function(err, client) {
        assert.equal(null, err);

        const db = client.db("bk-iot-test");

        var cursor = db.collection('bk-iot-soil').find().sort({"created_at":-1});

        cursor.forEach(function(doc, err) {
            assert.equal(null, err);

            //console.log(doc.value);

            created_at.push(doc.created_at);
            data.push(JSON.parse(doc.value).data);

        }, function() {
            client.close();
            console.log('getting data completed !!!');
            console.log(created_at);
            console.log(data);
        });
    });
};

/*
setInterval(function() {
    getData();
}, 3000);
*/

module.exports = router;