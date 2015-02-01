/**
 * OrderController
 *
 * @description :: Server-side logic for managing Orders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


  pendingOrders: function(req, res){
    Order.find({state: {'!': 'served'}, sort: 'createdAt ASC'}).populate('customer').populate('menuItem').exec(function(err, orders){
      res.json(orders);
    });
  },

  /**
   * A fucking ghetto way of grouping but I'm too frustrated trying to do it with mongo
   * @param req
   * @param res
   */
  kitchen: function(req, res) {

    // https://codereview.stackexchange.com/questions/37028/grouping-elements-in-array-by-multiple-properties
    function groupBy( array , f )
    {
      var groups = {};
      array.forEach( function( o )
      {
        var group = JSON.stringify( f(o) );
        groups[group] = groups[group] || [];
        groups[group].push( o );
      });
      return Object.keys(groups).map( function( group )
      {
        return groups[group];
      })
    }

    Order.find({or: [{state: 'new'}, {state: 'preparing'}], sort: 'createdAt ASC' }).populate('customer').populate('menuItem').exec(function(err, orders){
      var groupedOrders = groupBy(orders, function(item){
        return [item.category, item.table];
      });

      var drinks = new Array();
      var entrees = new Array();
      var mains = new Array();
      var sides = new Array();
      var deserts = new Array();

      groupedOrders.forEach((function(group){
        group.forEach(function(subgroup){
          switch(subgroup.category){
            case 'drink':
              drinks.push(subgroup);
              break;
            case 'entree':
              entrees.push(subgroup);
              break;
            case 'main':
              mains.push(subgroup);
              break;
            case 'side':
              sides.push(subgroup);
              break;
            case 'desert':
              deserts.push(subgroup);
              break;
          }
        });

      }));

      return res.view('kitchen/main', {
        categories: [
          {name: 'drinks', data: drinks},
          {name: 'entrees', data: entrees},
          {name: 'mains', data: mains},
          {name: 'sides', data: sides},
          {name: 'deserts', data: deserts}
        ]
      });

    });


    // a part of me died...fuck...
    /*async.auto({
      drinks: function(next){
        Order.native(function(err, collection){
          collection.aggregate(
            [
              {
                $match: {
                  $and: [
                    {category: 'drink'},
                    {
                      $or:
                      [
                        {state: {$ne: 'ready'}},
                        {state: {$ne: 'served'}}
                      ]
                    }
                  ]
                }
              },
              {
                $group: {
                  _id: '$table',
                  timestamp: { $min: '$createdAt'},
                  orders: {$push: '$$ROOT'}
                }
              },
              {
                $sort: {
                  timestamp: 1
                }
              }
            ], function(err, items){
              next(null, items)
            }
          );
        });
      },
      entrees: function(next){
        Order.native(function(err, collection){
          collection.aggregate(
            [
              {
                $match: {
                  $and: [
                    {category: 'entree'},
                    {
                      $or:
                        [
                          {state: {$ne: 'ready'}},
                          {state: {$ne: 'served'}}
                        ]
                    }
                  ]
                }
              },
              {
                $group: {
                  _id: '$table',
                  timestamp: { $min: '$createdAt'},
                  orders: {$push: '$$ROOT'}
                }
              },
              {
                $sort: {
                  timestamp: 1
                }
              }
            ], function(err, items){
              next(null, items)
            }
          );
        });
      },
      mains: function(next){
        Order.native(function(err, collection){
          collection.aggregate(
            [
              {
                $match: {
                  $and: [
                    {category: 'main'},
                    {
                      $or:
                        [
                          {state: {$ne: 'ready'}},
                          {state: {$ne: 'served'}}
                        ]
                    }
                  ]
                }
              },
              {
                $group: {
                  _id: '$table',
                  timestamp: { $min: '$createdAt'},
                  orders: {$push: '$$ROOT'}
                }
              },
              {
                $sort: {
                  timestamp: 1
                }
              }
            ], function(err, items){
              next(null, items)
            }
          );
        });
      },
      sides: function(next){
        Order.native(function(err, collection){
          collection.aggregate(
            [
              {
                $match: {
                  $and: [
                    {category: 'side'},
                    {
                      $or:
                        [
                          {state: {$ne: 'ready'}},
                          {state: {$ne: 'served'}}
                        ]
                    }
                  ]
                }
              },
              {
                $group: {
                  _id: '$table',
                  timestamp: { $min: '$createdAt'},
                  orders: {$push: '$$ROOT'}
                }
              },
              {
                $sort: {
                  timestamp: 1
                }
              }
            ], function(err, items){
              next(null, items)
            }
          );
        });
      },
      deserts: function(next){
        Order.native(function(err, collection){
          collection.aggregate(
            [
              {
                $match: {
                  $and: [
                    {category: 'desert'},
                    {
                      $or:
                        [
                          {state: {$ne: 'ready'}},
                          {state: {$ne: 'served'}}
                        ]
                    }
                  ]
                }
              },
              {
                $group: {
                  _id: '$table',
                  timestamp: { $min: '$createdAt'},
                  orders: {$push: '$$ROOT'}
                }
              },
              {
                $sort: {
                  timestamp: 1
                }
              }
            ], function(err, items){
              next(null, items)
            }
          );
        });
      }
    },
      function allDone(err, async_data){
        return res.view('kitchen/main', {
          categories: async_data
        });
      }
    );*/

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

