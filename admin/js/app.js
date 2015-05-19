angular.module('joelDashBoard', ['ui.router', 'angular-jwt', 'angular-storage', 'joelDashBoard.login']).config([
  '$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'partials/login.html',
      controller: 'loginController'
    });
    return $urlRouterProvider.otherwise('/login');
  }
]).constant('API', {
  url: '../api/source/'
});
