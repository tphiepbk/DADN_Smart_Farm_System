const express = require('express');
const mongo = require('mongodb');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/get-data', function(req, res) {
    console.log('get data');
});

module.exports = router;