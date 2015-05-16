angular.module('joelDashBoard', ['ui.router']).config([
  '$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'partials/login.html'
    });
    return $urlRouterProvider.otherwise('/login');
  }
]);
