/**
 * canCreateMenu
 *
 * @module      :: Policy
 * @description :: Policy to allow the creation of new orders
 *                 This action is reserved to Maids and Admins
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  if(req.session.passport.user) {
    User.findOne({id: req.session.passport.user}).exec(function(err, user){
      if(user.accessLevel === 'admin' || user.accessLevel === 'maid') return next();
      else return res.forbidden('You are not permitted to perform this action.');
    })
  }

};
