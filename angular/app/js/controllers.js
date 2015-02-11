'use strict';

/* Controllers */

var maidcafeAppControllers = angular.module('maidcafeApp.controllers', []);

maidcafeAppControllers.controller('NavBarCtrl', [ '$scope', '$location', function($scope, $location) {
  $scope.isActive = function (location){
    return location === $location.path();
  };
}]);

maidcafeAppControllers.controller('MainCtrl', ['$scope', '$rootScope','$sails','$filter', function($scope, $rootScope, $sails,$filter){
  $rootScope.isNavBarVisible = false;
  (function() {
    $sails.get('/login')
      .success(function(data){
        if(data.user) {
          $scope.isLoginCollapsed = true;
          $rootScope.isNavBarVisible = true;
        }
      });

  })();
  /*$scope.login = function(){
    io.socket.post('/login', $scope.user)
      .success(function(data){
        console.log(data);
      })
      .error(function(err) { $rootScope.alerts.push({type: 'danger', msg: 'ERROR: Invalid credentials. Please try again.'});});
  };*/
}]);

maidcafeAppControllers.controller('MenuCtrl',
  ['$scope', '$rootScope','$sails','$filter',
    function($scope, $rootScope,$sails,$filter) {

      // collapse the add menu by default
      clearForm();
      $scope.categories = {
        drinks: {_id: 'drinks', items: []},
        entrees: {_id: 'entrees', items: []},
        mains: {_id: 'mains', items: []},
        sides: {_id: 'sides', items: []},
        desserts: {_id: 'desserts', items: []}
      };

      $scope.create = function(item){
        io.socket.post('/menuitem/create', item).success(function(data){
          if(data) clearForm();
        }).error(function(err){
          $rootScope.alerts.push({type: 'danger', msg: 'ERROR: Item not created. Verify all fields are filled and shortname is unique.'});
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
          case 'dessert':
            $scope.categories.desserts.items.push(datum);
            break;
        }
      }

      (function() {
        $sails.get("/menuitem").success(function (response) {
          response.forEach(function(datum){
            addToBucket(datum);
          });

        }).error(function (response) { $rootScope.alerts.push({type: 'warning', msg: 'There was a problem getting the menu. Please try again.'});});

        $sails.on('menuitem', function(message){
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

maidcafeAppControllers.controller('MaidCtrl', ['$scope','$rootScope', '$sails','$filter',
  function($scope,$rootScope,$sails,$filter) {
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
      desserts: {_id: 'desserts', items: []}
    };

    $scope.createCustomer = function(item){
      var newCustomerData = {
        table: $scope.newOrder.table,
        name: item.name
      };
      $sails.post('/customer/create', newCustomerData)
        .success(function(data){ if(data) clearCustomerForm(); })
        .error(function(err){ $rootScope.alerts.push({type:'danger', msg: 'ERROR: Customer not added. Please try again.'});});
    };

    $scope.createOrder = function(data){
      data.orders.forEach(function(order){
        var orderObject = {
          table: data.table,
          category: order.category,
          customer: data.customer,
          menuItem: order
        };
        $sails.post('/order/create', orderObject)
          .error(function(err){ $rootScope.alerts.push({type:'danger', msg: 'ERROR: Order not created. Please try again.'});});
      });

      // guess everything went well
      clearOrderForm();
    };

    $scope.serveOrder = function(order) {
      $sails.put('/order/' + order.id, {'state': 'served'})
        .error(function(err) { $rootScope.alerts.push({type: 'danger', msg: 'ERROR: Order not updated. Please try again.'});});
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
        case 'dessert':
          $scope.categories.desserts.items.push(datum);
          break;
      }
    }


    (function() {
      $sails.get('/customer/activeCustomers').success(function (response) {
        $scope.customers = response;
      }).error(function (response) { $rootScope.alerts.push({type: 'warning', msg: 'Could not get customer list.'});});

      $sails.get('/order/pendingOrders').success(function(response) {
        $scope.orders = response;
      }).error(function (response) {$rootScope.alerts.push({type: 'warning', msg: 'Could not get pending orders.'});});

      $sails.get('/menuitem').success(function (response) {
        response.forEach(function (datum){
          addToBucket(datum);
        });
      }).error(function (response) {$rootScope.alerts.push({type: 'warning', msg: 'Could not get menu.'});});

      $sails.on('customer', function(message){
        switch (message.verb){
          case 'created':
            $scope.customers.push(message.data);
            $scope.$apply();
            break;
          default: return;
        }
      });

      $sails.on('order', function(message){
        switch (message.verb){
          case 'created':
            // annoying, have to populate objects ourselves
            $sails.get('/menuitem/' + message.data.menuItem)
              .success(function(menuitem){ message.data.menuItem = menuitem;})
              .error(function(err) { $rootScope.alerts.push({type: 'danger', msg: 'There was a problem updating the orders. Please refresh.'});});
            $sails.get('/customer/' + message.data.customer)
              .success(function(customer){ message.data.customer = customer;})
              .error(function(err) { $rootScope.alerts.push({type: 'danger', msg: 'There was a problem updating the orders. Please refresh.'});});

            $scope.orders.push(message.data);
            $scope.$apply();
            break;
          case 'updated':
            // we also get notified of relationships being updated, so ignore that
            if(!message.previous) break;
            var previous = $rootScope.findByProp($scope.orders, 'id', message.id);
            if(message.data.state === 'served') $scope.orders.splice($scope.orders.indexOf(previous), 1);
            else previous.state = message.data.state;

            $scope.$apply();
            break;
          //TODO: on destroyed
          default: return;
        }
      });

      $sails.on('menuitem', function(message){
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

maidcafeAppControllers.controller('KitchenCtrl', ['$scope', '$rootScope','$sails','$filter', function($scope, $rootScope,$sails,$filter){
  $scope.categories = {
    drinks: {_id: 'drinks', items: []},
    entrees: {_id: 'entrees', items: []},
    mains: {_id: 'mains', items: []},
    sides: {_id: 'sides', items: []},
    desserts: {_id: 'desserts', items: []}
  };

  $scope.updateOrder = function(order, state){
    $sails.put('/order/' + order.id, {'state': state})
      .error(function(err) { $rootScope.alerts.push({type: 'danger', msg: 'ERROR: There was a problem updating the order. Please try again.'});});
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
      case 'dessert':
        $scope.categories.desserts.items.push(datum);
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
      case 'dessert':
        $scope.categories.desserts.items.splice($scope.categories.drinks.items.indexOf(datum), 1);
        break;
    }
  }

  (function() {
    $sails.get('/order/pendingOrders').success(function(response){
      var groupedOrders = groupBy(response, function(item){
        return [item.category, item.table];
      });

      groupedOrders.forEach((function(group) {
        group.forEach(function (subgroup) {
          addToBucket(subgroup);
        });
      }));
    }).error(function (response) {$rootScope.alerts.push({type: 'warning', msg: 'Could not get pending orders.'});});

    $sails.on('order', function(message){
      switch (message.verb){
        case 'created':
          // annoying, have to populate objects ourselves
          $sails.get('/menuitem/' + message.data.menuItem)
            .success(function(menuitem) { message.data.menuItem = menuitem;})
            .error(function(err) {$rootScope.alerts.push({type: 'danger', msg: 'There was a problem updating orders. Please refresh.'});});
          $sails.get('/customer/' + message.data.customer)
            .success(function(customer) { message.data.customer = customer; })
            .error(function(err) {$rootScope.alerts.push({type: 'danger', msg: 'There was a problem updating orders. Please refresh.'});});

          addToBucket(message.data);
          $scope.$apply();
          break;
        case 'updated':
          // we also get notified of relationships being updated, so ignore that
          if(!message.previous) break;
          // just in case there are multiple kitchen sessions, check and update value in scope too
          var previous;

          switch (message.previous.category){
            case 'drink':
              previous = $rootScope.findByProp($scope.categories.drinks.items, 'id', message.id);
              break;
            case 'entree':
              previous = $rootScope.findByProp($scope.categories.entrees.items, 'id', message.id);
              break;
            case 'main':
              previous = $rootScope.findByProp($scope.categories.mains.items, 'id', message.id);
              break;
            case 'side':
              previous = $rootScope.findByProp($scope.categories.sides.items, 'id', message.id);
              break;
            case 'dessert':
              previous = $rootScope.findByProp($scope.categories.desserts.items, 'id', message.id);
              break;
          }

          if(previous) {
            if(message.data.state === 'served') removeFromBucket(previous);
            else previous.state = message.data.state;
          }
          $scope.$apply();
          break;
        //TODO: on destroyed
        default: return;
      }
    });

  })();
}]);

maidcafeAppControllers.controller('CashierCtrl', ['$scope', '$rootScope','$sails','$filter', function($scope, $rootScope,$sails,$filter){

  $scope.customers = {};
  $scope.menuitems = {};
  $scope.isCheckoutCollapsed = true;

  $scope.getTotal = function (customer){
    var total = 0.00;
    customer.orders.forEach(function(order){
      if(!order.menuItem.price){
        var item = $rootScope.findByProp($scope.menuitems, 'id', order.menuItem); // y u so expensive
        order.menuItem = item; //you'll thank me at checkout
      }
      total += order.menuItem.price;
    });
    return total;
  };

  $scope.checkout = function(customer){
    $scope.selectedCustomers = [customer];
    $scope.isCheckoutCollapsed = false;
  };

  $scope.cancelCheckout = function(){
    $scope.selectedCustomers = [];
    $scope.isCheckoutCollapsed = true;
  };

  $scope.confirmCheckout = function(customer){
    // mark each order as paid
    customer.orders.forEach(function(order){
      $sails.put('/order/' + order.id, {paid: true})
        .error(function(err) {$rootScope.alerts.push({type: 'danger', msg: 'ERROR: There was a problem with the checkout. Please try again.'});});
    });
    // timestamp customer
    $sails.put('/customer/' + customer.id, {paidAt: new Date().toISOString()})
      .error(function(err) {$rootScope.alerts.push({type: 'danger', msg: 'ERROR: There was a problem with the checkout. Please try again.'});});
    $scope.selectedCustomers = {};  // socket.on will take care of actually removing it from customers
    $scope.isCheckoutCollapsed = true;
  };

  (function() {
    $sails.get('/customer/activeCustomers')
      .success(function(response){ $scope.customers = response;})
      .error(function(err) {$rootScope.alerts.push({type: 'warning', msg: 'Could not get customers.'});});

    $sails.get('/menuitem')
      .success(function(response){ $scope.menuitems = response;})
      .error(function(err) {$rootScope.alerts.push({type: 'warning', msg: 'Could not get menu.'});});

    $sails.on('customer', function(message){
      switch (message.verb){
        case 'addedTo':
          var customer = $rootScope.findByProp($scope.customers, 'id', message.id);
          // need to query the order data
          $sails.get('/order/' + message.addedId)
            .success(function(order){ customer.orders.push(order);})
            .error(function(err) {$rootScope.alerts.push({type: 'danger', msg: 'There was a problem updating customers. Please refresh.'});});
          $scope.$apply();
          break;
        case 'created':
          // simply push to customers since orders are always empty on new customers
          $scope.customers.push(message.data);
          $scope.$apply();
          break;
        // TODO: whatever verb gets applied when an order is deleted, removedFrom?
        default: return;
      }
    });

  })();
}]);
