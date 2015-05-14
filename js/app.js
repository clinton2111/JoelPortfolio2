angular.module('joelPortfolio', ['ui.router', 'ngMdIcons', 'joelPortfolio.controller', 'joelPortfolio.directives']).config([
  '$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider.state('home', {
      url: '/home',
      templateUrl: 'partials/main.html',
      controller: 'MainController'
    });
    return $urlRouterProvider.otherwise('/home');
  }
]);
