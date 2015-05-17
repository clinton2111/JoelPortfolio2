angular.module 'joelDashBoard',['ui.router','joelDashBoard.loginController']
.config ['$stateProvider', '$urlRouterProvider', '$httpProvider',($stateProvider,$urlRouterProvider,$httpProvider)->
  $stateProvider.state 'login',
    url:'/login'
    templateUrl:'partials/login.html'
    controller:'loginController'
  $urlRouterProvider.otherwise '/login'


]