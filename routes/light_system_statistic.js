const express = require('express');
const router = express.Router();

router.get('/light_system_statistic', function(req, res) {
    res.render('light_system_statistic');
});

module.exports = router;