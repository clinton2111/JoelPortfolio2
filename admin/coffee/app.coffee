angular.module 'joelDashBoard',['ui.router']
.config ['$stateProvider', '$urlRouterProvider', '$httpProvider',($stateProvider,$urlRouterProvider,$httpProvider)->
  $stateProvider.state 'login',
    url:'/login'
    templateUrl:'partials/login.html'
#    controller:'MainController'
  $urlRouterProvider.otherwise '/login'


]