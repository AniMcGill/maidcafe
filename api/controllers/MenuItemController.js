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
  /*create: function (req, res) {
    MenuItem.create(req.body).exec(function(err, item) {
      res.redirect('#/menu');
    });
  },*/


  /**
   * `MenuItemController.destroy()`
   */
  /*destroy: function (req, res) {
    MenuItem.destroy({id: req.param('id')}).exec(function() {
      *//*res.redirect('/menu');*//*
      res.end();
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
   * `MenuItemController.main()`
   */
  main: function (req, res) {
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
          return res.view({
            menuitems: menuitems
          });
        }
      );
    });
  },

  categories: function (req, res) {
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
          if(req.isSocket){
            //MenuItem.subscribe(req.socket, menuitems);
            MenuItem.watch(req.socket);
          }
         /* MenuItem.subscribe(menuitems);*/
          return res.json(menuitems);
        }
      );
    });
  }
};

