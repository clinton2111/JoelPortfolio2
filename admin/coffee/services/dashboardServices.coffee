angular.module 'joelDashBoard.DashCtrl'
.factory 'Insert', ['Upload', '$http', '$q', 'API', (Upload, $http, $q, API)->
  return(
    uploadPhoto: (picData)->
      q = $q.defer();
      Upload.upload
        url: API.url + 'insert.php'
        data:
          'caption': picData.Caption
          'location': 'photos'
        method: 'post'
        headers: {'Content-Type': picData.File[0].type}
        file: picData.File[0]
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise

    uploadGig: (data, file)->
      data.location = 'gigs'
      q = $q.defer();
      Upload.upload
        url: API.url + 'insert.php'
        data: data
        method: 'post'
        headers: {'Content-Type': file.type}
        file: file
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise
  )
]

.factory 'Search', ['$http', '$q', 'API', ($http, $q, API)->
  return(
    fetchPhotos: ()->
      q = $q.defer();
      $http
        url: API.url + 'search.php'
        data:
          'location': 'photos'
        method: 'post'
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise

    fetchGigs: ()->
      q = $q.defer();
      $http
        url: API.url + 'search.php'
        data:
          'location': 'gigs'
        method: 'post'
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise
  )
]

.factory 'Update', ['$http', '$q', 'API', 'Upload', ($http, $q, API, Upload)->
  return(
    updateCaption: (data)->
      data.location = 'photos'

      q = $q.defer();
      $http
        url: API.url + 'update.php'
        data: data
        method: 'post'
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise

    updateGigPoster: (data, file)->
      data.location = 'gigs'
      q = $q.defer();
      Upload.upload
        url: API.url + 'update.php'
        data: data
        method: 'post'
        headers: {'Content-Type': file.type}
        file: file
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise

    updateGigInfo: (data)->
      data.location = 'gigs'
      data.updateType='info'
      q = $q.defer();
      $http
        url: API.url + 'update.php'
        data: data
        method: 'post'
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise
  )
]
.factory 'Delete', ['$http', '$q', 'API', ($http, $q, API)->
  return(
    deletePhoto: (data)->
      data.location = 'photos'
      q = $q.defer();
      $http
        url: API.url + 'delete.php'
        data: data
        method: 'post'
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise

    deleteGig: (data)->
      data.location = 'gigs'
      q = $q.defer();
      $http
        url: API.url + 'delete.php'
        data: data
        method: 'post'
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise
  )
]