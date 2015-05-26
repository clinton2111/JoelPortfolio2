angular.module 'joelDashBoard.DashCtrl', []
.controller 'dashboardController', ['$scope', 'store', 'API', 'Insert', 'Search', 'Update', 'Delete',
  ($scope, store, API, Insert, Search, Update, Delete)->
    onLoadComplete = ()->
      $ ".button-collapse"
      .sideNav();
      $ '.materialboxed'
      .materialbox();


    $scope.$on('$viewContentLoaded', onLoadComplete);

    $scope.user = store.get 'user'
    $scope.dpUrl = API.url + 'pic.php?id=' + $scope.user.id + '&&from=users'
    $scope.picUrl = API.url + 'pic.php?from=photos&&id='

    $scope.fetchPhotos = ->
      Search.fetchPhotos()
      .then (data)->
        response = data.data
        if response.status is 'Success'
          $scope.photos = response.results
      , (error)->
        console.log error

    $scope.openPhotoModal = ()->
      $ 'input#caption'
      .characterCounter()
      $ '#photoModal'
      .openModal();

    $scope.openCaptionModal = (index)->
      caption = $scope.photos[index].caption;
      if caption is "" then caption = null
      $scope.currentPic = {
        Caption: caption
        Index: index
      }
      $ '#updateCaption'
      .openModal();

    $scope.uploadPhoto = (pic)->
      Insert.uploadPhoto(pic)
      .then (data)->
        response = data.data
        if response.status is 'Success'
          $scope.photos.unshift({
            id: response.id
            caption: pic.Caption
          })
          Materialize.toast response.status + " - " + response.message, 4000
        else
          Materialize.toast response.status + " - " + response.message, 4000
      , (error)->
        console.log error

    $scope.editCaption = (index)->
      id = $scope.photos[index].id
      new_caption = $scope.currentPic.Caption
      data =
        caption: new_caption
        id: id
      Update.updateCaption(data)
      .then (data)->
        response = data.data
        if response.status is 'Success'
          $scope.photos[index].caption = new_caption
          Materialize.toast response.status + " - " + response.message, 4000
        else
          Materialize.toast response.status + " - " + response.message, 4000
      , (error)->
        Materialize.toast('Something went wrong', 4000);


    $scope.deletePhoto = (index)->
      id = $scope.photos[index].id
      data =
        id: id
      Delete.deletePhoto(data)
      .then (data)->
        response = data.data
        if response.status is 'Success'
          $scope.photos.splice(index,1);
          Materialize.toast response.status + " - " + response.message, 4000
        else
          Materialize.toast response.status + " - " + response.message, 4000
      , (error)->
        Materialize.toast('Something went wrong', 4000);


    $scope.$watch $scope.photos, ()->
      $scope.$apply
    , true

]