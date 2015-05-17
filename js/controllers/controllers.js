angular.module('joelPortfolio').controller('MainController', [
  '$scope', '$q', '$timeout', 'mainServices', function($scope, $q, $timeout, mainServices) {
    var onLoadComplete;
    onLoadComplete = function() {
      console.log('Called');
      $(".button-collapse").sideNav();
      $('.parallax').parallax();
      return $('.materialboxed').materialbox();
    };
    $scope.$on('$viewContentLoaded', onLoadComplete);
    $(window).scroll(function() {
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
    $scope.gigs = mainServices.getGigs();
    $scope.photos = mainServices.getPics();
    return $scope.sendEmail = function() {
      console.log($scope.email);
      return mainServices.sendEmail();
    };
  }
]);
