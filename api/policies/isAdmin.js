/**
 * isAdmin
 *
 * @module      :: Policy
 * @description :: Simple policy to check for admin user
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  if(req.session.passport.user) {
    User.findOne({id: req.session.passport.user}).exec(function(err, user){
      if(user.accessLevel === 'admin') return next();
      else return res.forbidden('You are not permitted to perform this action.');
    })
  }

};
