angular.module('joelPortfolio.controller', []).controller('MainController', [
  '$scope', '$q', '$timeout', function($scope, $q, $timeout) {
    var onLoadComplete;
    onLoadComplete = function() {
      $(".button-collapse").sideNav();
      $('.parallax').parallax();
      return $('.materialboxed').materialbox();
    };
    $scope.$on('$viewContentLoaded', onLoadComplete);
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
