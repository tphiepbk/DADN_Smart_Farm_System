const express = require('express');
const router = express.Router();

router.get('/water_pump', function(req, res) {
    res.render('water_pump');
});

module.exports = router;