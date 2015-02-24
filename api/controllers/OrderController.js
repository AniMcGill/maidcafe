/**
 * OrderController
 *
 * @description :: Server-side logic for managing Orders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  pendingOrders: function(req, res){
    Order.find({state: {'!': 'served'}, sort: 'createdAt ASC'}).populate('customer').populate('menuItem').exec(function(err, orders){
      if(err) return res.serverError(err);
      Order.watch(req);
      Order.subscribe(req.socket, orders);
      res.json(orders);
    });
  },

  paidOrders: function(req, res) {
    Order.find({paid: true}).populate('customer').populate('menuItem').exec(function(err, orders) {
      if(err) return res.serverError(err);
      Order.watch(req);
      Order.subscribe(req.socket, orders);
      res.json(orders);
    });
  }

};

