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
  $routeProvider.when('/main', {templateUrl: 'main/main.html', controller: 'MainCtrl'});
  $routeProvider.when('/menu', {templateUrl: 'menu/menu.html', controller: 'MenuCtrl'});
  $routeProvider.when('/maid', {templateUrl: 'maid/maid.html', controller: 'MaidCtrl'});
  $routeProvider.otherwise({redirectTo: '/main'});
}]).
run(function($rootScope) {
    $rootScope.tables = [];
    for (var i = 1; i <=30; i++){
      $rootScope.tables.push(i);
    }
});
