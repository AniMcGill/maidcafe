'use strict';

// Declare app level module which depends on views, and components
angular.module('maidcafeApp', [
  'ngRoute',
  'ngSails',
  'ui.bootstrap',
  'checklist-model',
  'maidcafeApp.controllers',
  'maidcafeApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {templateUrl: 'views/main.html', controller: 'MainCtrl'});
  $routeProvider.when('/menu', {templateUrl: 'views/menu.html', controller: 'MenuCtrl'});
  $routeProvider.when('/maid', {templateUrl: 'views/maid.html', controller: 'MaidCtrl'});
  $routeProvider.when('/kitchen', {templateUrl: 'views/kitchen.html', controller: 'KitchenCtrl'});
  $routeProvider.when('/cashier', {templateUrl: 'views/cashier.html', controller: 'CashierCtrl'});
  $routeProvider.otherwise({redirectTo: '/main'});
}]).
run(function($rootScope) {
    $rootScope.tables = [];
    for (var i = 1; i <=30; i++){
      $rootScope.tables.push(i);
    }
    // https://stackoverflow.com/questions/21199759/angularjs-filter-comparator-true-while-displaying-ng-repeat-list-when-input-fiel
    $rootScope.tableComparator = function(actual, expected){
      if(!expected) return true;
      return expected.table === actual.table;
    }
});
