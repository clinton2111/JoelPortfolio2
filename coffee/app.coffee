angular.module 'joelPortfolio',['ui.router','ngMaterial','ngMdIcons','joelPortfolio.controller','joelPortfolio.directives','angular-parallax']
.config ['$stateProvider', '$urlRouterProvider', '$httpProvider','$mdThemingProvider',($stateProvider,$urlRouterProvider,$httpProvider,$mdThemingProvider)->
  $stateProvider.state 'home',
    url:'/home'
    templateUrl:'partials/main.html'
    controller:'MainController'
  $urlRouterProvider.otherwise '/home'

  $mdThemingProvider.theme 'default'
  .primaryPalette 'grey',
    'default': '500'
    'hue-1': '200'
    'hue-2': '400'
    'hue-3': '900'
  .accentPalette 'amber',
    'default': '500'
  .warnPalette 'red',
    'default': '500'

]