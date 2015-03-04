/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  if(process.env.ADMIN_PASS) User.create( { username: 'admin', password: process.env.ADMIN_PASS, accessLevel: 'admin' } ).exec(cb);
  if(process.env.MAID_PASS) User.create( { username: 'maid', password: process.env.MAID_PASS, accessLevel: 'maid' } ).exec(cb);
  if(process.env.KITCHEN_PASS) User.create( { username: 'kitchen', password: process.env.KITCHEN_PASS, accessLevel: 'kitchen' } ).exec(cb);
  if(process.env.CASHIER_PASS) User.create( { username: 'cashier', password: process.env.CASHIER_PASS, accessLevel: 'cashier' } ).exec(cb);

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
