angular.module 'joelDashBoard.login'
.factory 'Auth',['$http','$q','API',($http,$q,API)->
  return(
    signIn:(userCredentials)->
      q=$q.defer()
      $http.post API.url+'login.php',userCredentials
      .then (data)->
        q.resolve data.data
      ,(error)->
        q.reject(data)

      q.promise
  )
]