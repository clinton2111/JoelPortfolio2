angular.module 'joelPortfolio',['ui.router']
.config ['$stateProvider', '$urlRouterProvider', '$httpProvider',($stateProvider,$urlRouterProvider,$httpProvider)->
  $stateProvider.state 'home',
    url:'/home'
    templateUrl:'partials/main.html'
    controller:'MainController'
  $urlRouterProvider.otherwise '/home'


]