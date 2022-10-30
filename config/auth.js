module.exports = {
  ensureAuthenticated: function(req, res, next) {
    // if (req.isAuthenticated()) {
    //   return next();
    // }
    // req.flash('error_msg', 'Login to view');
    // res.redirect('/login');
    return next();
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();  

      
    }
    res.redirect('/');      
  }
};



