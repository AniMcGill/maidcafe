/**
 * OrderController
 *
 * @description :: Server-side logic for managing Orders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {



  /**
   * `OrderController.create()`
   */
  create: function (req, res) {
    if(req.method == 'GET') {
      MenuItem.native(function(err, collection){
        if (err) return res.serverError(err);
        collection.aggregate(
          [{
            $group: {
              _id: "$category",
              items: { $push: "$$ROOT"}
            }
          }],
          function(err, menuitems){
            if (err) return res.serverError(err);
            Customer.find({ table: req.param('table') }).exec(function(err, customers){
              if (err) return res.serverError(err);

              return res.view({
                table: req.param('table'),
                customers: customers,
                menuitems: menuitems
              });
            });
          }
        );
      });
    }
    else {
      if(req.body.orders instanceof Array){
        req.body.orders.forEach(function(menuitem){
          Order.create({
            customer: req.body.customer,
            menuItem: menuitem
          }).exec(function(next){});
        });
      }
      else {
        Order.create({
          customer: req.body.customer,
          menuItem: req.body.orders
        }).exec(function(next){});
      }

      res.redirect('/orders');
    }
  },


  /**
   * `OrderController.destroy()`
   */
  destroy: function (req, res) {
    return res.json({
      todo: 'destroy() is not implemented yet!'
    });
  },


  /**
   * `OrderController.modify()`
   */
  modify: function (req, res) {
    return res.json({
      todo: 'modify() is not implemented yet!'
    });
  },

  /**
   * `OrderController.main()`
   * Show unpaid orders and their current state
   */
  main: function (req, res) {
    Order.find({where: {paid: false}, sort: 'createdAt ASC' }).populate('customer').populate('menuItem').exec(function(err, orders){
      if(err) return res.serverError(err);
      return res.view({
        orders: orders
      });
    });
  },

  /**
   * `OrderController.prepare()`
   */
  prepare: function (req, res) {
    return res.json({
      todo: 'prepare() is not implemented yet!'
    });
  },


  /**
   * `OrderController.readyToServe()`
   */
  readyToServe: function (req, res) {
    return res.json({
      todo: 'readyToServe() is not implemented yet!'
    });
  },


  /**
   * `OrderController.serve()`
   */
  serve: function (req, res) {
    return res.json({
      todo: 'serve() is not implemented yet!'
    });
  },

  pay: function (req, res) {
    return res.json({
      todo: 'pay() is not implemented yet!'
    });
  }
};

