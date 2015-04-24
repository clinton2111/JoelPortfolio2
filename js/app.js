angular.module('joelPortfolio', ['ui.router', 'joelPortfolio.controller']).config('joelPortfolio.Controller', [
  '$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider.state('home', {
      url: '/home',
      templateUrl: 'partials/main.html',
      controller: 'MainController'
    });
    return $urlRouterProvider.otherwise('/home');
  }
]);
