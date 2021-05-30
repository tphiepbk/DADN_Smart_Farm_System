const express = require('express');
const router = express.Router();

router.get('/water_pump_system_statistic', function(req, res) {
    res.render('water_pump_system_statistic');
});

module.exports = router;