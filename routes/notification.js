const express = require('express');
const router = express.Router();

router.get('/notification', function(req, res) {
    res.render('notification');
});

module.exports = router;