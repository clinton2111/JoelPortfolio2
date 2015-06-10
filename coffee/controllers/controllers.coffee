angular.module 'joelPortfolio'
.controller 'MainController', ['$scope', '$q', '$timeout', 'mainServices', 'API'
  ($scope, $q, $timeout, mainServices, API)->
    onLoadComplete = ()->
      $ ".button-collapse"
      .sideNav();
      $ '.parallax'
      .parallax();


      mapOptions =
        zoom: 16
        mapTypeId: google.maps.MapTypeId.ROADMAP
        styles: [
          {
            'featureType': 'all'
            'stylers': [
              {'saturation': 0}
              {'hue': '#e7ecf0'}
            ]
          }
          {
            'featureType': 'road'
            'stylers': [{'saturation': -70}]
          }
          {
            'featureType': 'transit'
            'stylers': [{'visibility': 'off'}]
          }
          {
            'featureType': 'poi'
            'stylers': [{'visibility': 'off'}]
          }
          {
            'featureType': 'water'
            'stylers': [
              {'visibility': 'simplified'}
              {'saturation': -60}
            ]
          }
        ]

      $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    $scope.gigs = []
    $scope.photos = []
    markers = []
    $scope.picUrl =
      photo: API.url + '../../assets/images/photos/'
      gig: API.url + '../../assets/images/gigs/'

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
      $scope.loadingGigs = true
      mainServices.getGigs(offset)
      .then (data)->
        response = data.data
        _.each(response.results, (index)->
          $scope.gigs.push(index)
        )
      , (error)->
        console.log error
      .finally ->
        $scope.loadingGigs = false

    $scope.fetchPhotos = (offset = 0)->
      $scope.loadingPhotos = true
      mainServices.getPics(offset)
      .then (data)->
        response = data.data
        response = data.data
        _.each(response.results, (index)->
          $scope.photos.push(index)
        )
      , (error)->
        console.log error
      .finally ->
        $scope.loadingPhotos = false

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
        image: gig.photo_image

      if markers.length > 0
        markers[0].setMap null
        markers = []

      map_center = new google.maps.LatLng Number(gig.latitude), Number(gig.longitude)
      infowindow = new google.maps.InfoWindow();


      img =
        url: '../assets/icons/map_pointer.svg'
        origin: new google.maps.Point(0, 0)

      marker = new google.maps.Marker
        map: $scope.map,
        position: map_center,
        icon: img

      google.maps.event.addListener marker, 'mouseover', ()->
        infowindow.setContent(gig.title + ' - ' + gig.address);
        infowindow.open($scope.map, this);
        marker.setMap($scope.map)


      google.maps.event.addListener marker, 'mouseout', ()->
      infowindow.close()

      $ '#gigInfo'
      .openModal()

      google.maps.event.trigger($scope.map, "resize");
      $scope.map.setCenter(map_center);
      markers.push marker

    $scope.sendEmail = ()->
      mainServices.sendEmail($scope.email)
      .then (data)->
        response = data.data;
        if response.status is 'Success' then Materialize.toast(response.status + ' - ' + response.message, 4000)
        else
          Materialize.toast(response.status + ' - ' + response.message, 4000)
      , (error)->
        Materialize.toast('Opps something went wrong.', 4000)

    $scope.loadMoreGigs = ->
      id = $scope.gigs[$scope.gigs.length - 1].id
      mainServices.getGigs(id)
      .then (data)->
        response = data.data
        if response.status is 'Success'
          _.each(response.results, (index)->
            $scope.gigs.push(index)
          )
        else
          Materialize.toast response.message, 4000
      , (error)->
        console.log error

    $scope.loadMorePhotos = ->
      id = $scope.photos[$scope.photos.length - 1].id
      mainServices.getPics(id)
      .then (data)->
        response = data.data
        if response.status is 'Success'
          _.each(response.results, (index)->
            $scope.photos.push(index)
          )
        else
          Materialize.toast response.message, 4000
      , (error)->
        console.log error

    $scope.$watchCollection ['photos', 'gigs', 'loadingPhotos', 'loadingGigs'], ()->
      $scope.$apply
    , false


]
