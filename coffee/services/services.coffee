angular.module 'joelPortfolio'
.factory 'mainServices', ['$http', '$q', 'API', ($http, $q, API)->
  return(
    getGigs: (offset)->
      q = $q.defer()
      $http
        url: API.url + 'public.php'
        data:
          offset: offset
          fetch: 'gigs'
        method: 'POST'
      .then (data)->
        q.resolve(data)
      , (error)->
        q.reject(error)
      q.promise


    getPics: (offset)->
      q = $q.defer()
      $http
        url: API.url + 'public.php'
        data:
          offset: offset
          fetch: 'photos'
        method: 'POST'
      .then (data)->
        q.resolve(data)
      , (error)->
        q.reject(error)
      q.promise


    sendEmail: (emailData)->
      emailData.type = 'contact'
      q = $q.defer()
      $http
        url: API.url + 'mailer.php'
        data: emailData
        method: 'post'
      .then (data)->
        q.resolve data
      , (error)->
        q.reject error
      q.promise


  )

]