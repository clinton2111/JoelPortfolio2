angular.module 'joelPortfolio',['ui.router','mb-adaptive-backgrounds','angularLazyImg','duScroll']
.config ['$stateProvider', '$urlRouterProvider', '$httpProvider',($stateProvider,$urlRouterProvider,$httpProvider)->
  $stateProvider.state 'home',
    url:'/home'
    templateUrl:'partials/main.html'
    controller:'MainController'
  $urlRouterProvider.otherwise '/home'
]
.constant 'API',
  url: '../api/source/'