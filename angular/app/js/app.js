'use strict';

// Declare app level module which depends on views, and components
angular.module('maidcafeApp', [
  'ngRoute',
  'ngSails',
  'ui.bootstrap',
  'maidcafeApp.controllers',
  /*'maidcafeApp.main',
  'maidcafeApp.menu',*/
  'maidcafeApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {templateUrl: 'main/main.html', controller: 'MainCtrl'});
  $routeProvider.when('/menu', {templateUrl: 'menu/menu.html', controller: 'MenuCtrl'});
  $routeProvider.otherwise({redirectTo: '/main'});
}]);
