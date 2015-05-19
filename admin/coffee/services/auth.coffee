angular.module 'joelDashBoard.login'
.factory 'Auth', ['$http', '$q', 'API', ($http, $q, API)->
  return(
    signIn: (userCredentials)->
      q = $q.defer()
      $http
        url: API.url + 'login.php'
        method: 'POST'
        data: userCredentials
      .then (data)->
        q.resolve data.data
      , (error)->
        q.reject(data)

      q.promise
  )
]