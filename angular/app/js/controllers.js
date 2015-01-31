'use strict';

/* Controllers */

var maidcafeAppControllers = angular.module('maidcafeApp.controllers', []);

maidcafeAppControllers.controller('NavBarCtrl', [ '$scope', '$location', function($scope, $location) {
  $scope.isActive = function (location){
    return location === $location.path();
  };
}]);

maidcafeAppControllers.controller('MainCtrl', '$scope', function($scope){

});

maidcafeAppControllers.controller('MenuCtrl',
  ['$scope','$sails','$filter',
    function($scope,$sails,$filter) {

      // collapse the add menu by default
      clearForm();
      $scope.categories = {
        drinks: {_id: 'drinks', items: []},
        entrees: {_id: 'entrees', items: []},
        mains: {_id: 'mains', items: []},
        sides: {_id: 'sides', items: []},
        deserts: {_id: 'deserts', items: []}
      };

      $scope.create = function(item){
        io.socket.post('/menuitem/create', item, function(data) {
          if(data){
            clearForm();
          }
        });
      };

      $scope.destroy = function(item){
        io.socket.get('/menuitem/destroy/' + item);
      };

      function clearForm(){
        $scope.item = {};
        $scope.isAddMenuCollapsed = true;
      }

      // ugly triaging
      function addToBucket(datum){
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
      }

      function removeFromBucket(datum){
        switch (datum.category){
          case 'drink':
            $scope.categories.drinks.items.splice($scope.categories.drinks.items.indexOf(datum), 1);
            break;
          case 'entree':
            $scope.categories.entrees.items.splice($scope.categories.drinks.items.indexOf(datum), 1);
            break;
          case 'main':
            $scope.categories.mains.items.splice($scope.categories.drinks.items.indexOf(datum), 1);
            break;
          case 'side':
            $scope.categories.sides.items.splice($scope.categories.drinks.items.indexOf(datum), 1);
            break;
          case 'desert':
            $scope.categories.deserts.items.splice($scope.categories.drinks.items.indexOf(datum), 1);
            break;
        }
      }

      (function() {
        io.socket.get("/menuitem").success(function (response) {
          response.forEach(function(datum){
            addToBucket(datum);
          });

        }).error(function (response) { console.log('error');});

        io.socket.on('menuitem', function(message){
          switch (message.verb){
            case 'created':
              addToBucket(message.data);
              $scope.$apply();
              break;
            case 'destroyed':
              removeFromBucket(message.previous);
              $scope.$apply();
              break;
            default: return;
          }
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

}]);

maidcafeAppControllers.controller('MaidCtrl', ['$scope','$sails','$filter',
  function($scope,$sails,$filter) {
    $scope.customers = {};
    $scope.orders = {};

    clearCustomerForm();
    clearOrderForm();

    $scope.categories = {
      drinks: {_id: 'drinks', items: []},
      entrees: {_id: 'entrees', items: []},
      mains: {_id: 'mains', items: []},
      sides: {_id: 'sides', items: []},
      deserts: {_id: 'deserts', items: []}
    };

    $scope.createCustomer = function(item){
      var newCustomerData = {
        table: $scope.newOrder.table,
        name: item.name
      };
      io.socket.post('/customer/create', newCustomerData, function(data){
        if(data){
          clearCustomerForm();
        }
      });
    };

    function clearCustomerForm(){
      if($scope.newCustomer){
        $scope.newCustomer.name = "";
      }
      else {
        $scope.newCustomer = {};
      }
    }

    function clearOrderForm(){
      $scope.isAddOrderCollapsed = true;
    }

    // ugly triaging
    function addToBucket(datum){
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
    }

    (function() {
      io.socket.get('/customer').success(function (response) {
        $scope.customers = response;
      }).error(function (response) { console.log('error');});

      io.socket.get('/order').success(function(response) {
        $scope.orders = response;
      }).error(function (response) {console.log('error');});

      io.socket.get('/menuitem').success(function (response) {
        response.forEach(function (datum){
          addToBucket(datum);
        });
      }).error(function (response) {console.log('error');});

      io.socket.on('customer', function(message){
        switch (message.verb){
          case 'created':
            $scope.customers.push(message.data);
            $scope.$apply();
            break;
          default: return;
        }
      });

      io.socket.on('order', function(message){
        switch (message.verb){
          case 'created':
            console.log(message);
            break;
          default: return;
        }
      });

      io.socket.on('menuitem', function(message){
        switch (message.verb){
          case 'created':
            addToBucket(message.data);
            $scope.$apply();
            break;
          default: return;
        }
      });

    })();

  }]);
