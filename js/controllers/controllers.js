angular.module('joelPortfolio').controller('MainController', [
  '$scope', '$q', '$timeout', 'mainServices', 'API', function($scope, $q, $timeout, mainServices, API) {
    var onLoadComplete;
    onLoadComplete = function() {
      $(".button-collapse").sideNav();
      $('.parallax').parallax();
      return $('.materialboxed').materialbox();
    };
    $scope.picUrl = {
      photo: API.url + 'pic.php?from=photos&&id=',
      gig: API.url + 'pic.php?from=gigs&&id='
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
    $scope.fetchGigs = function(offset) {
      if (offset == null) {
        offset = 0;
      }
      return mainServices.getGigs(offset).then(function(data) {
        var response;
        response = data.data;
        return $scope.gigs = response.results;
      }, function(error) {
        return console.log(error);
      });
    };
    $scope.fetchPhotos = function(offset) {
      if (offset == null) {
        offset = 0;
      }
      return mainServices.getPics(offset).then(function(data) {
        var response;
        response = data.data;
        return $scope.photos = response.results;
      }, function(error) {
        return console.log(error);
      });
    };
    $scope.sendEmail = function() {
      return mainServices.sendEmail();
    };
    return $scope.$watchCollection(['photos', 'gigs'], function() {
      return $scope.$apply;
    }, false);
  }
]);
