angular.module 'joelDashBoard', ['ui.router', 'angular-jwt', 'angular-storage', 'joelDashBoard.login']
.config ['$stateProvider', '$urlRouterProvider', '$httpProvider', ($stateProvider, $urlRouterProvider, $httpProvider)->
  $stateProvider
  .state 'login',
    url: '/login'
    templateUrl: 'partials/login.html'
    controller: 'loginController'
  .state 'dashboard',
    url: '/dashboard'
    templateUrl: 'partials/dashboard.html'
    data:
      requiresLogin: true

  $urlRouterProvider.otherwise '/login'


]
.run ['$rootScope', '$state', 'store', 'jwtHelper', '$http', 'API', '$q',
  ($rootScope, $state, store, jwtHelper, $http, API, $q)->

    $rootScope.$on '$stateChangeStart', (e, to)->
      refreshToken= (token)->
        q = $q.defer()
        $http.post API.url + 'refreshToken.php', token
        .then (data)->
          console.log(data)
          q.resolve(data.data)
        , (error)->
          console.log 'Error'
          q.reject(data)
        q.promise

      user = store.get 'user'
      if to.data && to.data.requiresLogin
        if _.isNull(user) || _.isUndefined(user) || jwtHelper.isTokenExpired(user.token)
          e.preventDefault();
          $state.go 'login'
        else
          lastUpdate = moment(user.lastUpdate, 'DD-MM-YYYY')
          refreshTokenFlag = moment().isSame(moment(lastUpdate), 'day')

          if !refreshTokenFlag
            refreshToken(user.token)
            .then (data)->
              tokenData = data
              userObj =
                token: tokenData.token
                username: tokenData.username
                lastUpdate: moment().format('DD-MM-YYYY')
              store.set 'user', userObj
            , (error)->
              e.preventDefault();

          else
            console.log 'in Sync'


]
.constant 'API',
  url: '../api/source/'
