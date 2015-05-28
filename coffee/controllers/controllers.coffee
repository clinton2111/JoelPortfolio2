angular.module 'joelPortfolio'
.controller 'MainController', ['$scope', '$q', '$timeout', 'mainServices','API'
  ($scope, $q, $timeout, mainServices,API)->
    onLoadComplete = ()->
      $ ".button-collapse"
      .sideNav();
      $ '.parallax'
      .parallax();

      $ '.materialboxed'
      .materialbox();

    $scope.picUrl =
      photo: API.url + 'pic.php?from=photos&&id=',
      gig: API.url + 'pic.php?from=gigs&&id='

    $scope.$on('$viewContentLoaded', onLoadComplete);

    $ window
    .scroll ()->
      st = $(this).scrollTop()
      winH = $(this).height()
      #        you can set this add,
      #        depends on where you want the animation to start
      #        for example if the section height is 100 and you set add of 50,
      #        that means if 50% of the section is revealed
      #        on the bottom of viewport animate opacity
      add = 150

      $ 'section'
      .each ()->
        pos = $(this).position().top
        if(st + winH >= pos + add)
          $(this).stop().animate({opacity: 1, marginTop: 10}, 'fast');
        else
          $(this).stop().animate({opacity: 0, marginTop: 0}, 'fast');

    $scope.fetchGigs = (offset = 0)->
      mainServices.getGigs(offset)
      .then (data)->
        response = data.data
        $scope.gigs = response.results
      , (error)->
        console.log error

    $scope.fetchPhotos = (offset = 0)->
      mainServices.getPics(offset)
      .then (data)->
        response = data.data
        $scope.photos = response.results
      , (error)->
        console.log error

    $scope.sendEmail = ()->
      mainServices.sendEmail()

    $scope.$watchCollection ['photos', 'gigs'], ()->
      $scope.$apply
    , false


]
