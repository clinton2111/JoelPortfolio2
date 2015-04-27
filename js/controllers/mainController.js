angular.module('joelPortfolio.controller', []).controller('MainController', [
  '$scope', '$q', '$timeout', '$mdSidenav', '$location', '$anchorScroll', function($scope, $q, $timeout, $mdSidenav, $location, $anchorScroll) {
    $scope.toggleNav = function() {
      console.log('Toggled');
      return $mdSidenav('left').toggle();
    };
    return $scope.navigateTo = function(id) {
      console.log('Navigate to ' + id);
      $location.hash(id);
      return $anchorScroll();
    };
  }
]);
