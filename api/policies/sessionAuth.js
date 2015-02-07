/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  if(req.session.passport.user) return next();
  /*if(req.isSocket){
    if(req.session && req.session.passport && req.session.passport.user){
      sails.config.passport.initialize()(req, res, function() {
        sails.config.passport.session()(req, res, function() {
          res.locals.user = req.user;
          next();
        });
      });
    } else req.json(401);
  }
  else if(req.isAuthenticated()) return next();*/

  /*if (req.session.authenticated) {
    return next();
  }*/

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  return res.forbidden('You are not permitted to perform this action.');
};
