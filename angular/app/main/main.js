'use strict';

angular.module('maidcafeApp.main', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: '../views/main.html',
    controller: 'MainCtrl'
  });
}])

.controller('MainCtrl', [function() {

}]);
