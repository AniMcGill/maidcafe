'use strict';

/* Controllers */

var maidcafeAppControllers = angular.module('maidcafeApp.controllers', []);

maidcafeAppControllers.controller('MainCtrl', [function() {
}]);

maidcafeAppControllers.controller('MenuCtrl',
  ['$scope','$sails','$filter',
    function($scope,$sails,$filter) {
      ///////////

      // collapse the add menu by default
      $scope.isAddMenuCollapsed = true;
      /*$scope.categories = [
        {id: 'drinks', items: []},
        {id: 'entrees', items: []},
        {id: 'mains', items: []},
        {id: 'sides', items: []},
        {id: 'deserts', items: []}
      ];*/
      $scope.categories = {
        drinks: {_id: 'drinks', items: []},
        entrees: {_id: 'entrees', items: []},
        mains: {_id: 'mains', items: []},
        sides: {_id: 'sides', items: []},
        deserts: {_id: 'deserts', items: []}
      };

      (function() {
        /*$sails.get('/menuitem/categories').success(function (response) {
          $scope.categories = response;
        }).error(function (response) { console.log('error');});*/

        /*$sails.get('/menuitem/subscribe').success(function (response) {
          console.log(response);
          console.log('subscribed to menuitems');
        });*/

        $sails.get("/menuitem").success(function (response) {
          //$scope.categories = response;
          // ugly triage
          response.forEach(function(datum){
            switch (datum.category){
              case 'drink':
                    $scope.categories.drinks.items.push(datum);
                    break;
              case 'entree':
                    $scope.categories.entrees.items.push(datum);
                    break;
              case 'main':
                $scope.categories.mains.items.push(datum);
                break;
              case 'side':
                $scope.categories.sides.items.push(datum);
                break;
              case 'desert':
                $scope.categories.deserts.items.push(datum);
                break;
            }
          });

        }).error(function (response) { console.log('error');});

        $sails.on('menuitem', function(message){
          console.log('sails published a message for item: '+message.verb);
        });

        /*$sails.on('item', function ( message ) {
          console.log('sails published a message for item: '+message.verb);
          switch (message.verb)
          {
            case 'created':
              console.log("pushing "+JSON.stringify(message.data));
              $scope.items.push(message.data);
              $scope.lookup = {};
              for (var i in $scope.items)
              {
                $scope.lookup[$scope.items[i].id] = i;
              }
              break;
            case 'destroyed':
              $scope.items = $scope.items.filter(function(item) {
                return item.id != message.id;
              });
              $scope.lookup = {};
              for (var i in $scope.items)
              {
                $scope.lookup[$scope.items[i].id] = i;
              }
              break;
            case 'addedTo':
              var idx = $scope.lookup[message.id];
              $sails.get("/task/"+message.addedId).success(function (aTask) {
                $scope.items[idx].tasks.push(aTask);
              }).error(function (aTask) { console.log('error');});
              break;
            case 'removedFrom':
              var idx = $scope.lookup[message.id];
              $scope.items[idx].tasks = $scope.items[idx].tasks.filter(function(task) {
                return task.id != message.removedId;
              });
              break;
          }
        });*/

        /*$sails.on('task', function ( message ) {
          console.log('sails published a message for task: '+message.verb);
        });*/

      })();
      ///////////

}]);


