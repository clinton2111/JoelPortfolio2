angular.module('joelPortfolio').controller('MainController', [
  '$scope', '$q', '$timeout', 'mainServices', 'API', function($scope, $q, $timeout, mainServices, API) {
    var markers, onLoadComplete;
    onLoadComplete = function() {
      var mapOptions;
      $(".button-collapse").sideNav();
      $('.parallax').parallax();
      $('.materialboxed').materialbox();
      mapOptions = {
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            'featureType': 'all',
            'stylers': [
              {
                'saturation': 0
              }, {
                'hue': '#e7ecf0'
              }
            ]
          }, {
            'featureType': 'road',
            'stylers': [
              {
                'saturation': -70
              }
            ]
          }, {
            'featureType': 'transit',
            'stylers': [
              {
                'visibility': 'off'
              }
            ]
          }, {
            'featureType': 'poi',
            'stylers': [
              {
                'visibility': 'off'
              }
            ]
          }, {
            'featureType': 'water',
            'stylers': [
              {
                'visibility': 'simplified'
              }, {
                'saturation': -60
              }
            ]
          }
        ]
      };
      return $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    };
    markers = [];
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
    $scope.getGigInfo = function(id) {
      var gig, img, index, infowindow, map_center, marker;
      index = _.findIndex($scope.gigs, {
        id: id
      });
      gig = $scope.gigs[index];
      $scope.gigInfo = {
        id: id,
        title: gig.title,
        address: gig.address,
        date: gig.event_date,
        fbLink: gig.fb_link,
        lat: gig.latitude,
        lng: gig.longitude
      };
      if (markers.length > 0) {
        markers[0].setMap(null);
        markers = [];
      }
      map_center = new google.maps.LatLng(Number(gig.latitude), Number(gig.longitude));
      infowindow = new google.maps.InfoWindow();
      img = {
        url: '../assets/icons/map_pointer.svg',
        origin: new google.maps.Point(0, 0)
      };
      marker = new google.maps.Marker({
        map: $scope.map,
        position: map_center,
        icon: img
      });
      google.maps.event.addListener(marker, 'mouseover', function() {
        infowindow.setContent(gig.title + ' - ' + gig.address);
        infowindow.open($scope.map, this);
        return marker.setMap($scope.map);
      });
      google.maps.event.addListener(marker, 'mouseout', function() {});
      infowindow.close();
      $('#gigInfo').openModal();
      google.maps.event.trigger($scope.map, "resize");
      $scope.map.setCenter(map_center);
      return markers.push(marker);
    };
    $scope.sendEmail = function() {
      return mainServices.sendEmail($scope.email).then(function(data) {
        var response;
        response = data.data;
        if (response.status === 'Success') {
          return Materialize.toast(response.status + ' - ' + response.message, 4000);
        } else {
          return Materialize.toast(response.status + ' - ' + response.message, 4000);
        }
      }, function(error) {
        return Materialize.toast('Opps something went wrong.', 4000);
      });
    };
    return $scope.$watchCollection(['photos', 'gigs'], function() {
      return $scope.$apply;
    }, false);
  }
]);
