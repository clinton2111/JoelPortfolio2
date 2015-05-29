angular.module 'joelDashBoard.DashCtrl', []
.controller 'dashboardController', ['$scope', 'store', 'API', 'Insert', 'Search', 'Update', 'Delete', '$state'
  ($scope, store, API, Insert, Search, Update, Delete, $state)->
    onLoadComplete = ()->
      $ ".button-collapse"
      .sideNav();
      $ '.materialboxed'
      .materialbox()
      $ '.collapsible'
      .collapsible
          accordion: false


    $scope.gPlace;
    $scope.$on('$viewContentLoaded', onLoadComplete);

    $scope.user = store.get 'user'
    $scope.dpUrl = API.url + 'pic.php?id=' + $scope.user.id + '&&from=users'
    $scope.picUrl =
      photo: API.url + 'pic.php?from=photos&&id='
      gig: API.url + 'pic.php?from=gigs&&id='

    $scope.toggleEdit = (id)->
      index = _.findIndex($scope.gigs, {id: id});
      $ '.datepicker'
      .pickadate
          container: 'body'
          selectMonths: true,
          selectYears: 15
          format: 'dd-mm-yyyy'
      gig = $scope.gigs[index]
      if gig.fb_link is '#' then gig.fb_link = ''
      $scope.new = {
        title: gig.title
        place: gig.address
        fbLink: gig.fb_link
        lat: gig.lat
        lng: gig.lng
      }
      document.getElementById('new_date-' + id).value = moment(gig.event_date, "DD-MM-YYYY").format("DD-MM-YYYY")

    $scope.fetchPhotos = ->
      Search.fetchPhotos()
      .then (data)->
        response = data.data
        if response.status is 'Success'
          $scope.photos = response.results
      , (error)->
        console.log error

    $scope.fetchGigs = ->
      Search.fetchGigs()
      .then (data)->
        response = data.data
        if response.status is 'Success'
          $scope.gigs = response.results
      , (error)->
        console.log error


    $scope.openPhotoModal = ()->
      $ 'input#caption'
      .characterCounter()
      $ '#photoModal'
      .openModal();

    $scope.openGigModal = ()->
      $ '.datepicker'
      .pickadate
          container: 'body'
          selectMonths: true,
          selectYears: 15
          format: 'dd-mm-yyyy'


      $ '#gigModal'
      .openModal();

    $scope.openCaptionModal = (id)->
      index = _.findIndex($scope.photos, {id: id});
      caption = $scope.photos[index].caption;
      if caption is "" then caption = null
      $scope.currentPic = {
        Caption: caption
        Id: id
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
          $scope.pic = {};
          Materialize.toast response.status + " - " + response.message, 4000
        else
          Materialize.toast response.status + " - " + response.message, 4000
      , (error)->
        console.log error

    $scope.uploadGig = (gig)->
      date = document.getElementById("date").value
      if !(_.isNull(gig.fbLink) and _.isUndefined(gig.fbLink) and _.isEmpty(gig.fbLink)) then gig.fbLink = '#'

      data =
        title: gig.title
        date: date
        address: gig.place
        lat: gig.placeDetails.geometry.location.lat()
        lng: gig.placeDetails.geometry.location.lng()
        fbLink: gig.fbLink

      file = gig.File[0]
      $ '#photoModal'
      .closeModal();
      Insert.uploadGig(data, file)
      .then (data)->
        response = data.data
        if response.status is 'Success'
          $scope.gigs.unshift({
            id: response.id
            title: gig.title
            address: gig.place
            latitude: gig.placeDetails.geometry.location.lat()
            longitude: gig.placeDetails.geometry.location.lng()
            event_date: date
            fb_link: gig.fbLink
          })
          $scope.gig = {};
          Materialize.toast response.status + " - " + response.message, 4000
        else
          Materialize.toast response.status + " - " + response.message, 4000
      , (error)->
        console.log error

    $scope.deletePhoto = (id)->
      index = _.findIndex($scope.photos, {id: id});
      data =
        id: id
      Delete.deletePhoto(data)
      .then (data)->
        response = data.data
        if response.status is 'Success'
          $scope.photos.splice(index, 1);
          Materialize.toast response.status + " - " + response.message, 4000
        else
          Materialize.toast response.status + " - " + response.message, 4000
      , (error)->
        Materialize.toast('Something went wrong', 4000);

    $scope.deleteGig = (id)->
      index = _.findIndex($scope.gigs, {id: id});
      data =
        id: id
      Delete.deleteGig(data)
      .then (data)->
        response = data.data
        if response.status is 'Success'
          $scope.gigs.splice(index, 1);
          Materialize.toast response.status + " - " + response.message, 4000
        else
          Materialize.toast response.status + " - " + response.message, 4000
      , (error)->
        Materialize.toast('Something went wrong', 4000);

    $scope.updatePoster = (id, poster)->
      if !_.isUndefined poster.File[0]
        index = _.findIndex($scope.gigs, {id: id});
        file = poster.File[0]
        data =
          updateType: 'poster'
          id: id

        Update.updateGigPoster(data, file)
        .then (data)->
          response = data.data
          if response.status is 'Success'
            $scope.gigs[index].id = id;
            Materialize.toast response.status + " - " + response.message, 4000
          else
            Materialize.toast response.status + " - " + response.message, 4000
        , (error)->
          Materialize.toast('Something went wrong', 4000);

    $scope.updateGig = (id, newdata)->
      date = document.getElementById('new_date-' + id).value
      index = _.findIndex($scope.gigs, {id: id});
      if !(_.isNull(newdata.fbLink) and _.isUndefined(newdata.fbLink) and _.isEmpty(newdata.fbLink)) then newdata.fbLink = '#'
      if (typeof newdata.placeDetails is 'undefined')
        lat = $scope.gigs[index].latitude
        lng = $scope.gigs[index].longitude
        console.log lat + ' ' + lng
      else
        lat = newdata.placeDetails.geometry.location.lat()
        lng = newdata.placeDetails.geometry.location.lng()
        console.log 'there'
      data =
        title: newdata.title
        date: date
        address: newdata.place
        lat: lat
        lng: lng
        fbLink: newdata.fbLink
        id: id
      Update.updateGigInfo(data)
      .then (data)->
        response = data.data
        if response.status is 'Success'
          $scope.gigs[index] = ({
            id: id
            title: newdata.title
            address: newdata.place
            latitude: lat
            longitude: lng
            event_date: date
            fb_link: newdata.fbLink
          })
          $scope.fetchGigs()
          Materialize.toast response.status + " - " + response.message, 4000
        else
          Materialize.toast response.status + " - " + response.message, 4000
      , (error)->
        console.log error


    $scope.updateCaption = (id)->
      index = _.findIndex($scope.photos, {id: id});
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

    $scope.logout = ->
      store.remove 'user'
      $state.go 'login'
    $scope.$watchCollection ['photos', 'gigs'], ()->
      $scope.$apply
    , false


]