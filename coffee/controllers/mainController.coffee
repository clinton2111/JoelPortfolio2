angular.module 'joelPortfolio.controller', []
.controller 'MainController', ['$scope', '$q', '$timeout','$location', '$anchorScroll',
  ($scope, $q, $timeout, $mdSidenav, $location, $anchorScroll)->



    onLoadComplete=()->
      $ ".button-collapse"
      .sideNav();
      $ '.parallax'
      .parallax();

    $scope.$on('$viewContentLoaded', onLoadComplete);




    $scope.navigateTo = (id)->
#      Set div id to the id received by the function
      console.log 'Navigate to ' + id
      $location.hash id
      $anchorScroll()

    $ window
    .scroll ()->
      st = $(this).scrollTop()
      winH=$(this).height()
#        you can set this add,
#        depends on where you want the animation to start
#        for example if the section height is 100 and you set add of 50,
#        that means if 50% of the section is revealed
#        on the bottom of viewport animate opacity
      add=150

      $ 'section'
      .each ()->
        pos=$(this).position().top
        if(st + winH >= pos + add)
          $(this).stop().animate({opacity:1, marginTop:10},'fast');
        else
          $(this).stop().animate({opacity:0, marginTop:0},'fast');



]
