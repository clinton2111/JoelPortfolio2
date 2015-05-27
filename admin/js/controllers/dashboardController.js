angular.module('joelDashBoard.DashCtrl', []).controller('dashboardController', [
  '$scope', 'store', 'API', 'Insert', 'Search', 'Update', 'Delete', function($scope, store, API, Insert, Search, Update, Delete) {
    var onLoadComplete;
    onLoadComplete = function() {
      $(".button-collapse").sideNav();
      $('.materialboxed').materialbox();
      return $('.collapsible').collapsible({
        accordion: false
      });
    };
    $scope.gPlace;
    $scope.$on('$viewContentLoaded', onLoadComplete);
    $scope.user = store.get('user');
    $scope.dpUrl = API.url + 'pic.php?id=' + $scope.user.id + '&&from=users';
    $scope.picUrl = {
      photo: API.url + 'pic.php?from=photos&&id=',
      gig: API.url + 'pic.php?from=gigs&&id='
    };
    $scope.fetchPhotos = function() {
      return Search.fetchPhotos().then(function(data) {
        var response;
        response = data.data;
        if (response.status === 'Success') {
          return $scope.photos = response.results;
        }
      }, function(error) {
        return console.log(error);
      });
    };
    $scope.fetchGigs = function() {
      return Search.fetchGigs().then(function(data) {
        var response;
        response = data.data;
        if (response.status === 'Success') {
          return $scope.gigs = response.results;
        }
      }, function(error) {
        return console.log(error);
      });
    };
    $scope.openPhotoModal = function() {
      $('input#caption').characterCounter();
      return $('#photoModal').openModal();
    };
    $scope.openGigModal = function() {
      $('.datepicker').pickadate({
        container: 'body',
        selectMonths: true,
        selectYears: 15,
        format: 'dd-mm-yyyy'
      });
      return $('#gigModal').openModal();
    };
    $scope.openCaptionModal = function(id) {
      var caption, index;
      index = _.findIndex($scope.photos, {
        id: id
      });
      caption = $scope.photos[index].caption;
      if (caption === "") {
        caption = null;
      }
      $scope.currentPic = {
        Caption: caption,
        Id: id
      };
      return $('#updateCaption').openModal();
    };
    $scope.uploadPhoto = function(pic) {
      return Insert.uploadPhoto(pic).then(function(data) {
        var response;
        response = data.data;
        if (response.status === 'Success') {
          $scope.photos.unshift({
            id: response.id,
            caption: pic.Caption
          });
          $scope.pic = {};
          return Materialize.toast(response.status + " - " + response.message, 4000);
        } else {
          return Materialize.toast(response.status + " - " + response.message, 4000);
        }
      }, function(error) {
        return console.log(error);
      });
    };
    $scope.uploadGig = function(gig) {
      var data, date, file;
      date = document.getElementById("date").value;
      if (!(_.isNull(gig.fbLink) && _.isUndefined(gig.fbLink) && _.isEmpty(gig.fbLink))) {
        gig.fbLink = '#';
      }
      data = {
        title: gig.title,
        date: date,
        address: gig.place,
        lat: gig.placeDetails.geometry.location.lat(),
        lng: gig.placeDetails.geometry.location.lng(),
        fbLink: gig.fbLink
      };
      file = gig.File[0];
      $('#photoModal').closeModal();
      return Insert.uploadGig(data, file).then(function(data) {
        var response;
        response = data.data;
        if (response.status === 'Success') {
          $scope.gigs.unshift({
            id: response.id,
            title: gig.title,
            address: gig.place,
            latitude: gig.placeDetails.geometry.location.lat(),
            longitude: gig.placeDetails.geometry.location.lng(),
            event_date: date,
            fb_link: gig.fbLink
          });
          $scope.gig = {};
          return Materialize.toast(response.status + " - " + response.message, 4000);
        } else {
          return Materialize.toast(response.status + " - " + response.message, 4000);
        }
      }, function(error) {
        return console.log(error);
      });
    };
    $scope.deletePhoto = function(id) {
      var data, index;
      index = _.findIndex($scope.photos, {
        id: id
      });
      data = {
        id: id
      };
      return Delete.deletePhoto(data).then(function(data) {
        var response;
        response = data.data;
        if (response.status === 'Success') {
          $scope.photos.splice(index, 1);
          return Materialize.toast(response.status + " - " + response.message, 4000);
        } else {
          return Materialize.toast(response.status + " - " + response.message, 4000);
        }
      }, function(error) {
        return Materialize.toast('Something went wrong', 4000);
      });
    };
    $scope.deleteGig = function(id) {
      var data, index;
      index = _.findIndex($scope.gigs, {
        id: id
      });
      data = {
        id: id
      };
      return Delete.deleteGig(data).then(function(data) {
        var response;
        response = data.data;
        if (response.status === 'Success') {
          $scope.gigs.splice(index, 1);
          return Materialize.toast(response.status + " - " + response.message, 4000);
        } else {
          return Materialize.toast(response.status + " - " + response.message, 4000);
        }
      }, function(error) {
        return Materialize.toast('Something went wrong', 4000);
      });
    };
    $scope.updatePoster = function(id, poster) {
      var data, file, index;
      if (!_.isUndefined(poster.File[0])) {
        index = _.findIndex($scope.gigs, {
          id: id
        });
        file = poster.File[0];
        data = {
          updateType: 'poster',
          id: id
        };
        return Update.updateGig(data, file).then(function(data) {
          var response;
          response = data.data;
          if (response.status === 'Success') {
            $scope.gigs[index].id = id;
            return Materialize.toast(response.status + " - " + response.message, 4000);
          } else {
            return Materialize.toast(response.status + " - " + response.message, 4000);
          }
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      }
    };
    $scope.editCaption = function(id) {
      var data, index, new_caption;
      index = _.findIndex($scope.photos, {
        id: id
      });
      new_caption = $scope.currentPic.Caption;
      data = {
        caption: new_caption,
        id: id
      };
      return Update.updateCaption(data).then(function(data) {
        var response;
        response = data.data;
        if (response.status === 'Success') {
          $scope.photos[index].caption = new_caption;
          return Materialize.toast(response.status + " - " + response.message, 4000);
        } else {
          return Materialize.toast(response.status + " - " + response.message, 4000);
        }
      }, function(error) {
        return Materialize.toast('Something went wrong', 4000);
      });
    };
    return $scope.$watchCollection(['photos', 'gigs'], function() {
      return $scope.$apply;
    }, false);
  }
]);
