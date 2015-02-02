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

      /*$scope.destroy = function(item){
        io.socket.get('/menuitem/destroy/' + item);
      };*/

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
            /*case 'destroyed':
              removeFromBucket(message.previous);
              $scope.$apply();
              break;*/
            default: return;
          }
        });
      })();
}]);

maidcafeAppControllers.controller('MaidCtrl', ['$scope','$sails','$filter',
  function($scope,$sails,$filter) {
    clearCustomerForm();
    clearOrderForm();

    // models
    $scope.customers = {};
    $scope.orders = {};
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

    $scope.createOrder = function(data){
      data.orders.forEach(function(order){
        var orderObject = {
          table: data.table,
          category: order.category,
          customer: data.customer,
          menuItem: order
        };
        io.socket.post('/order/create', orderObject);
      });

      // guess everything went well
      clearOrderForm();
    };

    $scope.serveOrder = function(order) {
      //TODO
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
      if($scope.newOrder){
        $scope.newOrder.customer = {};
        $scope.newOrder.orders = [];
      }
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
      }).error(function (response) { console.log('error getting customers');});

      io.socket.get('/order').success(function(response) {
        $scope.orders = response;
      }).error(function (response) {console.log('error getting orders');});

      io.socket.get('/menuitem').success(function (response) {
        response.forEach(function (datum){
          addToBucket(datum);
        });
      }).error(function (response) {console.log('error getting menu');});

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
            // annoying, have to populate objects ourselves
            io.socket.get('/menuitem/' + message.data.menuItem, function (menuitem){
              message.data.menuItem = menuitem;
            });
            io.socket.get('/customer/' + message.data.customer, function (customer){
              message.data.customer = customer;
            });
            $scope.orders.push(message.data);
            $scope.$apply();
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

maidcafeAppControllers.controller('KitchenCtrl', ['$scope', function($scope){
  $scope.categories = {
    drinks: {_id: 'drinks', items: []},
    entrees: {_id: 'entrees', items: []},
    mains: {_id: 'mains', items: []},
    sides: {_id: 'sides', items: []},
    deserts: {_id: 'deserts', items: []}
  };

  $scope.updateOrder = function(order, state){
    order.state = state;
    io.socket.put('/order/' + order.id, {'state': state}, function(resData){
    });
  };

  // https://codereview.stackexchange.com/questions/37028/grouping-elements-in-array-by-multiple-properties
  function groupBy( array , f ) {
    var groups = {};
    array.forEach( function( o ) {
      var group = JSON.stringify( f(o) );
      groups[group] = groups[group] || [];
      groups[group].push( o );
    });
    return Object.keys(groups).map( function( group ) {
      return groups[group];
    })
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

  function testAndModify(order, id, state){
    if(order.id === id) {
      order.state = state;
      return true;
    }
    return false;
  }

  // https://stackoverflow.com/questions/7364150/find-object-by-id-in-array-of-javascript-objects
  Array.prototype.filterObjects = function(key, value) {
    return this.filter(function(x) { return x[key] === value; })
  };

  (function() {
    io.socket.get('/order/pendingOrders').success(function(response){
      var groupedOrders = groupBy(response, function(item){
        return [item.category, item.table];
      });

      groupedOrders.forEach((function(group) {
        group.forEach(function (subgroup) {
          addToBucket(subgroup);
        });
      }));
    }).error(function (response) {console.log('error getting pending orders');});

    io.socket.on('order', function(message){
      switch (message.verb){
        case 'created':
          // annoying, have to populate objects ourselves
          io.socket.get('/menuitem/' + message.data.menuItem, function (menuitem){
            message.data.menuItem = menuitem;
          });
          io.socket.get('/customer/' + message.data.customer, function (customer){
            message.data.customer = customer;
          });
          addToBucket(message.data);
          $scope.$apply();
          break;
        case 'updated':
          // just in case there are multiple kitchen sessions, check and update value in scope too
          console.log(message);
          switch (message.previous.category){
            case 'drink':
              $scope.categories.drinks.filterObjects('id', message.id).state = message.data.state;
              break;
            case 'entree':
              $scope.categories.entrees.filterObjects('id', message.id).state = message.data.state;
              break;
            case 'main':
              $scope.categories.drinks.filterObjects('id', message.id).state = message.data.state;
              break;
            case 'side':
              $scope.categories.drinks.filterObjects('id', message.id).state = message.data.state;
              break;
            case 'desert':
              $scope.categories.drinks.filterObjects('id', message.id).state = message.data.state;
              break;
          }
        default: return;
      }
    });
    /*

    io.socket.on('order', function(message){
      switch (message.verb){
        case 'created':
          // annoying, have to populate objects ourselves
          io.socket.get('/menuitem/' + message.data.menuItem, function (menuitem){
            message.data.menuItem = menuitem;
          });
          io.socket.get('/customer/' + message.data.customer, function (customer){
            message.data.customer = customer;
          });
          $scope.orders.push(message.data);
          $scope.$apply();
          break;
        default: return;
      }
    });

    */

  })();
}]);
