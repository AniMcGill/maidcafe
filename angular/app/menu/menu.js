'use strict';

angular.module('maidcafeApp.menu', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/menu', {
    templateUrl: '../views/menu.html',
    controller: 'MenuCtrl'
  });
}])

.controller('MenuCtrl', [function() {

}]);
