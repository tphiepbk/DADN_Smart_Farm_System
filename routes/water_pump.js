const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('water_pump');
});

module.exports = router;