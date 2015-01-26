/**
 * CustomerController
 *
 * @description :: Server-side logic for managing Customers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {



  /**
   * `CustomerController.create()`
   */
  create: function (req, res) {
    Customer.create(req.body).exec(function(err,item){
      res.redirect('/customers');
    });
  },


  /**
   * `CustomerController.modify()`
   */
  modify: function (req, res) {
    return res.json({
      todo: 'modify() is not implemented yet!'
    });
  },

  /**
   * `CustomerController.destroy()`
   */
  destroy: function (req, res) {
    Customer.destroy({id: req.param('id')}).exec(function(){
      res.redirect('/customers');
    });
  },

  /**
   * `CustomerController.main()`
   * Show active (unpaid) customers and their current balances
   */
  main: function (req, res) {
    Customer.find({where: {paidAt: null}, sort:'table'}).populate('orders', {customer: {parent: '_id'}}).exec(function(err, customers) {
      if(err) return res.serverError(err);
      return res.view({
        customers: customers
      });
    });
  },

  /**
   * `CustomerController.table()`
   * Returns the list of active (unpaid) customers for the given table
   */
  /*table: function (req, res) {
    Customer.find({table: req.param('id')}).exec(function(err, customers) {
      if(err) return res.serverError(err);
      console.log(customers);
      return res.send(customers);
    });
  },*/

  /**
   * `CustomerController.checkout()`
   */
  checkout: function (req, res) {
    return res.json({
      todo: 'checkout() is not implemented yet!'
    });
  }
};

