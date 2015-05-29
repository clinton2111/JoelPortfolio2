angular.module('joelPortfolio', ['ui.router', 'mb-adaptive-backgrounds']).config([
  '$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider.state('home', {
      url: '/home',
      templateUrl: 'partials/main.html',
      controller: 'MainController'
    });
    return $urlRouterProvider.otherwise('/home');
  }
]).constant('API', {
  url: '../api/source/'
});
