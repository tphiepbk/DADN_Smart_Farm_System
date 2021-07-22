const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const connectionString = "mongodb+srv://tphiepbk:hiepit-2992@cluster0.axbkf.mongodb.net/bk-iot-test?retryWrites=true&w=majority";
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/', ensureAuthenticated, (req, res) =>

    res.render('index', {
    user: req.user
  })

);

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

router.get('/light_system_statistic', ensureAuthenticated, (req, res) =>
    res.render('light_system_statistic', {
    user: req.user
  })
);

router.get('/light', ensureAuthenticated, (req, res) =>
    res.render('light', {
    user: req.user
  })
);


router.get('/notification', ensureAuthenticated, (req, res) =>
    res.render('notification', {
    user: req.user
  })
);

router.get('/water_pump_system_statistic', ensureAuthenticated, (req, res) =>
    res.render('water_pump_system_statistic', {
    user: req.user
  })
);

router.get('/water_pump', ensureAuthenticated, (req, res) =>
    res.render('water_pump', {
    user: req.user
  })
);

router.get('/prediction', ensureAuthenticated, (req, res) =>
    res.render('prediction', {
    user: req.user
  })
);

module.exports = router;