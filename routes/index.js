const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>
    res.render('index', {
    user: req.user
  })
);

router.get('/light_system_statistic', (req, res) =>
    res.render('light_system_statistic', {
    user: req.user
  })
);

router.get('/light', (req, res) =>
    res.render('light', {
    user: req.user
  })
);

router.get('/notification', (req, res) =>
    res.render('notification', {
    user: req.user
  })
);

router.get('/water_pump_system_statistic', (req, res) =>
    res.render('water_pump_system_statistic', {
    user: req.user
  })
);

router.get('/water_pump', (req, res) =>
    res.render('water_pump', {
    user: req.user
  })
);

router.get('/prediction', (req, res) =>
    res.render('prediction', {
    user: req.user
  })
);

module.exports = router;
