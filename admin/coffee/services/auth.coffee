angular.module 'joelDashBoard.login'
.factory 'Auth', ['$http', '$q', 'API', ($http, $q, API)->
  return(
    signIn: (userCredentials)->
      q = $q.defer()
      $http
        url: API.url + 'login.php'
        method: 'POST'
        data: userCredentials
        skipAuthorization: true
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)

      q.promise
  )
]