/**
 * AuthController
 *
 * @description :: Server-side logic for managing user authentication
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var passport = require('passport');

module.exports = {
  _config:{
    actions: false,
    shortcuts: false,
    rest: false
  },

  login: function(req, res){
    // ugly hack for checking if authenticated on socket
    if(req.isSocket){
      if(req.session.passport.user) return res.json({user: req.session.passport.user});
      else return res.json({});
    }

    passport.authenticate('local', function(err, user, info){
      if(err || !user) return res.send({message: info.message, user:user});
      req.logIn(user, function(err){
        if(err) res.send(err);
        // ugly hack for sockets
        res.redirect('/');
        //return res.json({message: info.message, user:user});
      });
    })(req, res);
  },

  logout: function(req,res){
    req.logout();
    res.redirect('/');
  }
};

