angular.module 'joelPortfolio.controller', []
.controller 'MainController', ['$scope', '$q', '$timeout', '$mdSidenav', '$location', '$anchorScroll',
  ($scope, $q, $timeout, $mdSidenav, $location, $anchorScroll)->
    $scope.toggleNav = ()->
      console.log 'Toggled'
      $mdSidenav 'left'
      .toggle()

    $scope.navigateTo = (id)->
#      Set div id to the id received by the function
      console.log 'Navigate to ' + id
      $location.hash id
      $anchorScroll()

]
