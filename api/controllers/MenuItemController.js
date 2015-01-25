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
      res.end(JSON.stringify(item));
    });
  },


  /**
   * `MenuItemController.delete()`
   */
  /*delete: function (req, res) {
    return res.json({
      todo: 'delete() is not implemented yet!'
    });
  },*/


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
   * `MenuItemController.view()`
   */
  menu: function (req, res) {
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
          entrees: async_data.entrees,
          mains: async_data.mains,
          sides: async_data.sides,
          deserts: async_data.deserts,
          drinks: async_data.drinks
        });
    });
    /*MenuItem.find().exec(function (err, menuitems){
      if(err) return res.serverError(err);

      return res.view({
        menuItems: menuitems
      });
    });*/
  }
};

