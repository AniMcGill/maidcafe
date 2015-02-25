'use strict';

// Declare app level module which depends on views, and components
angular.module('maidcafeApp', [
  'ngRoute',
  'ngSails',
  'ui.bootstrap',
  'checklist-model',
  'nvd3ChartDirectives',
  'maidcafeApp.controllers',
  'maidcafeApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {templateUrl: 'views/main.html', controller: 'MainCtrl'});
  $routeProvider.when('/menu', {templateUrl: 'views/menu.html', controller: 'MenuCtrl'});
  $routeProvider.when('/maid', {templateUrl: 'views/maid.html', controller: 'MaidCtrl'});
  $routeProvider.when('/kitchen', {templateUrl: 'views/kitchen.html', controller: 'KitchenCtrl'});
  $routeProvider.when('/cashier', {templateUrl: 'views/cashier.html', controller: 'CashierCtrl'});
  $routeProvider.when('/stats', {templateUrl: 'views/stats.html', controller: 'StatsCtrl'});
  $routeProvider.otherwise({redirectTo: '/main'});
}]).
run(function($rootScope) {
    $rootScope.isNavBarVisible = true;
    $rootScope.alerts = [];
    $rootScope.closeAlert = function(index){
      $rootScope.alerts.splice(index, 1);
    };
    $rootScope.tables = [];
    for (var i = 1; i <=30; i++){
      $rootScope.tables.push(i);
    }
    // https://stackoverflow.com/questions/21199759/angularjs-filter-comparator-true-while-displaying-ng-repeat-list-when-input-fiel
    $rootScope.tableComparator = function(actual, expected){
      if(!expected) return true;
      return expected.table === actual.table;
    }

    // http://stackoverflow.com/questions/12946353/javascript-find-object-in-array-by-value-and-append-additional-value
    $rootScope.findByProp = function (arr, prop, val){
      for (var i = 0; i< arr.length; i++){
        if (typeof arr[i][prop] === 'undefined') continue;
        if (arr[i][prop] === val) return arr[i];
      }
      return false;
    }
});
