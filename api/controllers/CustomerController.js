/**
 * CustomerController
 *
 * @description :: Server-side logic for managing Customers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  activeCustomers: function (req, res) {
    Customer.find({where: {paidAt: null}, sort:'table'}).populate('orders').exec(function (err, customers) {
      if(err) return res.serverError(err);
      Customer.watch(req);
      Customer.subscribe(req.socket, customers);
      res.json(customers);
    });
  },

  paidCustomers: function (req, res) {
    Customer.find({where: { paidAt: {'!': null} }}).populate('orders').exec(function (err, customers) {
      if(err) return res.serverError(err);
      Customer.watch(req);
      Customer.subscribe(req.socket, customers);
      res.json(customers);
    });
  }

};

