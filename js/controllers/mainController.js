angular.module('joelPortfolio.controller', []).controller('MainController', [
  '$scope', '$q', '$timeout', '$mdSidenav', '$location', '$anchorScroll', function($scope, $q, $timeout, $mdSidenav, $location, $anchorScroll) {
    $scope.toggleNav = function() {
      console.log('Toggled');
      return $mdSidenav('left').toggle();
    };
    $scope.navigateTo = function(id) {
      console.log('Navigate to ' + id);
      $location.hash(id);
      return $anchorScroll();
    };
    return $(window).scroll(function() {
      var add, st, winH;
      st = $(this).scrollTop();
      winH = $(this).height();
      add = 150;
      return $('section').each(function() {
        var pos;
        pos = $(this).position().top;
        if (st + winH >= pos + add) {
          return $(this).stop().animate({
            opacity: 1,
            marginTop: 10
          }, 'fast');
        } else {
          return $(this).stop().animate({
            opacity: 0,
            marginTop: 0
          }, 'fast');
        }
      });
    });
  }
]);
