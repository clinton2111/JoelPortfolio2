angular.module('joelPortfolio').controller('MainController', [
  '$scope', '$q', '$timeout', 'mainServices', 'API', function($scope, $q, $timeout, mainServices, API) {
    var markers, onLoadComplete;
    onLoadComplete = function() {
      var mapOptions;
      $(".button-collapse").sideNav();
      $('.parallax').parallax();
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
    $scope.gigs = [];
    $scope.photos = [];
    markers = [];
    $scope.picUrl = {
      photo: API.url + '../../assets/images/photos/',
      gig: API.url + '../../assets/images/gigs/'
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
      $scope.loadingGigs = true;
      return mainServices.getGigs(offset).then(function(data) {
        var response;
        response = data.data;
        return _.each(response.results, function(index) {
          return $scope.gigs.push(index);
        });
      }, function(error) {
        return console.log(error);
      })["finally"](function() {
        return $scope.loadingGigs = false;
      });
    };
    $scope.fetchPhotos = function(offset) {
      if (offset == null) {
        offset = 0;
      }
      $scope.loadingPhotos = true;
      return mainServices.getPics(offset).then(function(data) {
        var response;
        response = data.data;
        response = data.data;
        return _.each(response.results, function(index) {
          return $scope.photos.push(index);
        });
      }, function(error) {
        return console.log(error);
      })["finally"](function() {
        return $scope.loadingPhotos = false;
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
        lng: gig.longitude,
        image: gig.photo_image
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
    $scope.loadMoreGigs = function() {
      var id;
      id = $scope.gigs[$scope.gigs.length - 1].id;
      return mainServices.getGigs(id).then(function(data) {
        var response;
        response = data.data;
        if (response.status === 'Success') {
          return _.each(response.results, function(index) {
            return $scope.gigs.push(index);
          });
        } else {
          return Materialize.toast(response.message, 4000);
        }
      }, function(error) {
        return console.log(error);
      });
    };
    $scope.loadMorePhotos = function() {
      var id;
      id = $scope.photos[$scope.photos.length - 1].id;
      return mainServices.getPics(id).then(function(data) {
        var response;
        response = data.data;
        if (response.status === 'Success') {
          return _.each(response.results, function(index) {
            return $scope.photos.push(index);
          });
        } else {
          return Materialize.toast(response.message, 4000);
        }
      }, function(error) {
        return console.log(error);
      });
    };
    return $scope.$watchCollection(['photos', 'gigs', 'loadingPhotos', 'loadingGigs'], function() {
      return $scope.$apply;
    }, false);
  }
]);
