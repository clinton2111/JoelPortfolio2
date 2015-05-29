angular.module 'joelPortfolio'
.controller 'MainController', ['$scope', '$q', '$timeout', 'mainServices', 'API'
  ($scope, $q, $timeout, mainServices, API)->
    onLoadComplete = ()->
      $ ".button-collapse"
      .sideNav();
      $ '.parallax'
      .parallax();
      $ '.materialboxed'
      .materialbox();

      mapOptions =
        zoom: 16
        mapTypeId: google.maps.MapTypeId.ROADMAP
        styles:[
          {
            'featureType': 'all'
            'stylers': [
              { 'saturation': 0 }
              { 'hue': '#e7ecf0' }
            ]
          }
          {
            'featureType': 'road'
            'stylers': [ { 'saturation': -70 } ]
          }
          {
            'featureType': 'transit'
            'stylers': [ { 'visibility': 'off' } ]
          }
          {
            'featureType': 'poi'
            'stylers': [ { 'visibility': 'off' } ]
          }
          {
            'featureType': 'water'
            'stylers': [
              { 'visibility': 'simplified' }
              { 'saturation': -60 }
            ]
          }
        ]

      $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);



    markers=[]
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

    $scope.getGigInfo = (id)->
      index = _.findIndex($scope.gigs, {id: id});

      gig = $scope.gigs[index]
      $scope.gigInfo =
        id: id
        title: gig.title
        address: gig.address
        date: gig.event_date
        fbLink: gig.fb_link
        lat: gig.latitude
        lng: gig.longitude

      if markers.length>0
        markers[0].setMap null
        markers=[]

      map_center = new google.maps.LatLng Number(gig.latitude), Number(gig.longitude)
      infowindow = new google.maps.InfoWindow();


      img =
        url: '../assets/icons/map_pointer.svg'
        origin: new google.maps.Point(0, 0)

      marker = new google.maps.Marker
        map: $scope.map,
        position: map_center,
        icon: img

      google.maps.event.addListener marker,'mouseover',()->
        infowindow.setContent(gig.title+' - '+gig.address);
        infowindow.open($scope.map, this);
        marker.setMap($scope.map)


      google.maps.event.addListener marker,'mouseout',()->
      infowindow.close()

      $ '#gigInfo'
      .openModal()

      google.maps.event.trigger($scope.map, "resize");
      $scope.map.setCenter(map_center);
      markers.push marker

    $scope.sendEmail = ()->
      mainServices.sendEmail()

    $scope.$watchCollection ['photos', 'gigs'], ()->
      $scope.$apply
    , false


]
