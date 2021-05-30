const express = require('express');
const router = express.Router();

router.get('/database', function(req, res) {
    res.render('database');
});

module.exports = router;