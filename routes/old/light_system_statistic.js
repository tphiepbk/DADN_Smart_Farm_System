const express = require('express');
const router = express.Router();
router.get('/', function(req, res) {
    res.render('light_system_statistic');
});

module.exports = router;