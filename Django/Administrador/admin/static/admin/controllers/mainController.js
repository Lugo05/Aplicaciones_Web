var myApp = angular.module('Admin',['ngTable']);

myApp.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
}]);



myApp.controller('MainController',['$rootScope','$scope','$http','$location','$timeout',function($rootScope, $scope,$http,$location,$timeout,NgTableParams)
{

    
}]);
