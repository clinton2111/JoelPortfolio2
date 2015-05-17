angular.module('joelDashBoard', ['ui.router', 'joelDashBoard.loginController']).config([
  '$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'partials/login.html',
      controller: 'loginController'
    });
    return $urlRouterProvider.otherwise('/login');
  }
]);
