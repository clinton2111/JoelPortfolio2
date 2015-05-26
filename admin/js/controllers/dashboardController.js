angular.module('joelDashBoard.DashCtrl', []).controller('dashboardController', [
  '$scope', 'store', 'API', 'Insert', 'Search', 'Update', 'Delete', function($scope, store, API, Insert, Search, Update, Delete) {
    var onLoadComplete;
    onLoadComplete = function() {
      $(".button-collapse").sideNav();
      return $('.materialboxed').materialbox();
    };
    $scope.$on('$viewContentLoaded', onLoadComplete);
    $scope.user = store.get('user');
    $scope.dpUrl = API.url + 'pic.php?id=' + $scope.user.id + '&&from=users';
    $scope.picUrl = API.url + 'pic.php?from=photos&&id=';
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
    $scope.openPhotoModal = function() {
      $('input#caption').characterCounter();
      return $('#photoModal').openModal();
    };
    $scope.openCaptionModal = function(index) {
      var caption;
      caption = $scope.photos[index].caption;
      if (caption === "") {
        caption = null;
      }
      $scope.currentPic = {
        Caption: caption,
        Index: index
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
          return Materialize.toast(response.status + " - " + response.message, 4000);
        } else {
          return Materialize.toast(response.status + " - " + response.message, 4000);
        }
      }, function(error) {
        return console.log(error);
      });
    };
    $scope.editCaption = function(index) {
      var data, id, new_caption;
      id = $scope.photos[index].id;
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
    $scope.deletePhoto = function(index) {
      var data, id;
      id = $scope.photos[index].id;
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
    return $scope.$watch($scope.photos, function() {
      return $scope.$apply;
    }, true);
  }
]);