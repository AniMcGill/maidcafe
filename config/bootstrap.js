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

  //User.create({username: 'admin', password: 'goshujinsama'}).exec();
  // in production

  User.create({username: 'admin', password: process.env.ADMIN_PASS}).exec();
  /*if(process.env.MAID_USER && process.env.MAID_PASS) User.create({username: process.env.MAID_USER, password: process.env.MAID_PASS}).exec();
  if(process.env.KITCHEN_USER && process.env.KITCHEN_PASS) User.create({username: process.env.KITCHEN_USER, password: process.env.KITCHEN_PASS}).exec();
  if(process.env.CASHIER_USER && process.env.CASHIER_PASS) User.create({username: process.env.CASHIER_USER, password: process.env.CASHIER_PASS}).exec();*/

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
