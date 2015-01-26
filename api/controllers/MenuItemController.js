/**
 * MenuItemController
 *
 * @description :: Server-side logic for managing Menuitems
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * `MenuItemController.create()`
   */
  create: function (req, res) {
    MenuItem.create(req.body).exec(function(err, item) {
      res.redirect('/menu');
    });
  },


  /**
   * `MenuItemController.destroy()`
   */
  destroy: function (req, res) {
    MenuItem.destroy({id: req.param('id')}).exec(function() {
      res.redirect('/menu');
    });
  },


  /**
   * `MenuItemController.update()`
   */
  update: function (req, res) {
    MenuItem.update(req.body).done(function(err, item) {
      res.end(JSON.stringify(item));
    });
    /*return res.json({
      todo: 'update() is not implemented yet!'
    });*/
  },

  /**
   * `MenuItemController.main()`
   */
  main: function (req, res) {
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
      }
    },
      function allDone(err, async_data){
        if(err) return res.serverError(err);

        return res.view({
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
};

