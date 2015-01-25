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
    Customer.create(req.body).exec(function(err,res){
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
   * `CustomerController.list()`
   */
  list: function (req, res) {
    Customer.find().exec(function(err, customers) {
      if(err) return res.serverError(err);

      return res.view({
        customers: customers
      });
    });
  },

  /**
   * `CustomerController.checkout()`
   */
  checkout: function (req, res) {
    return res.json({
      todo: 'checkout() is not implemented yet!'
    });
  }
};

