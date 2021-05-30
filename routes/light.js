const express = require('express');
const router = express.Router();

router.get('/light', function(req, res) {
    res.render('light');
});

module.exports = router;