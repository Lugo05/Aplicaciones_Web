import * as controller from '../controller/massive.js';
import * as service from '../service/massive.js';
import * as component from '../component/massive.js';

var myApp = angular.module('AppMassive',[]);

myApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
}]);

myApp.service("ServiceMassive", ['$http' , service.serviceMassive]);
myApp.controller("ControllerMassive", controller.controllerMassive)
myApp.component("tableValidation", component.tableValidation);
