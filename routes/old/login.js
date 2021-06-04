const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require('../models/User');

router.get('/', function(req, res) {
    res.render('login');
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // check for missing filds
    if (!email || !password) {
      res.render("login");
      return;
    }

    const doesUserExits = await User.findOne({ email });

    if (!doesUserExits) {
      res.send("invalid username or password");
      res.render("login");
      return;
    }

    const doesPasswordMatch = await bcrypt.compare(
      password,
      doesUserExits.password
    );

    if (!doesPasswordMatch) {
      res.send("wrong password");
      return;
    }

    // else he\s logged in
    req.session.user = {
      email, 
    };

    res.redirect("/light");
  })



module.exports = router;