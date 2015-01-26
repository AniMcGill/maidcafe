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
      async.auto({
          entrees: function(next){
            MenuItem.find({ category: 'entree' }).exec(next);
          },
          mains: function(next){
            MenuItem.find({ category: 'main' }).exec(next);
          },
          sides: function(next){
            MenuItem.find({ category: 'side' }).exec(next);
          },
          deserts: function(next){
            MenuItem.find({ category: 'desert' }).exec(next);
          },
          drinks: function(next){
            MenuItem.find({ category: 'drink' }).exec(next);
          },
          customers: function(next){
            Customer.find({ table: req.param('table') }).exec(next);
          }
        },
        function allDone(err, async_data){
          if(err) return res.serverError(err);

          return res.view({
            table: req.param('table'),
            customers: async_data.customers,
            menuitems: [{
              name: 'Entree',
              data: async_data.entrees
            },
              {
                name: 'Main',
                data: async_data.mains
              },
              {
                name: 'Side',
                data: async_data.sides
              },
              {
                name: 'Desert',
                data: async_data.deserts
              },
              {
                name: 'Drink',
                data: async_data.drinks
              }]
          });
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
    Order.find({where: {paid: false} }).populate('customer').populate('menuItem').exec(function(err, orders){
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

