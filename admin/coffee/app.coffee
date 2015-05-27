angular.module 'joelDashBoard', ['ui.router', 'angular-jwt', 'angular-storage', 'joelDashBoard.login','joelDashBoard.DashCtrl','ngFileUpload']
.config ['$stateProvider', '$urlRouterProvider', '$httpProvider', 'jwtInterceptorProvider',
  ($stateProvider, $urlRouterProvider, $httpProvider, jwtInterceptorProvider)->
    $stateProvider
    .state 'login',
      url: '/login'
      templateUrl: 'partials/login.html'
      controller: 'loginController'
    .state 'dashboard',
      url: '/dashboard'
      abstract:true
      templateUrl: 'partials/dashboard.html'
      controller:'dashboardController'
      data:
        requiresLogin: true
    .state 'dashboard.home',
      url:''
      templateUrl:'partials/home.html'
      data:
        requiresLogin: true
    .state 'dashboard.photos',
      url:'/photos'
      templateUrl:'partials/photos.html'
      data:
        requiresLogin: true
    .state 'dashboard.gigs',
      url:'/gigs'
      templateUrl:'partials/gigs.html'
      data:
        requiresLogin: true
    .state 'dashboard.account',
      url:'/account'
      templateUrl:'partials/account.html'
      data:
        requiresLogin: true

    $urlRouterProvider.when('dashboard', 'dashboard.photos');
    $urlRouterProvider.otherwise '/login'

    jwtInterceptorProvider.tokenGetter = ['config', 'store', (config, store)->
      if config.url.substr(config.url.length - 5) is '.html'
        return null;
      else
        user = store.get 'user'
        if !(_.isNull(user.token)) || !(_.isUndefined(user.token))
          config.headers.Authorization =user.token;
    ]
    $httpProvider.interceptors.push 'jwtInterceptor'
]
.run ['$rootScope', '$state', 'store', 'jwtHelper', '$http', 'API', '$q',
  ($rootScope, $state, store, jwtHelper, $http, API, $q)->
    $rootScope.$on '$stateChangeStart', (e, to)->
      refreshToken = ()->
        q = $q.defer()
        $http.post API.url + 'refreshToken.php', null
        .then (data)->
#          console.log(data)
          q.resolve(data.data)
        , (error)->
          console.log 'Error'
          q.reject(data)
        q.promise

      user = store.get 'user'
      if to.data && to.data.requiresLogin
        if _.isNull(user) and _.isUndefined(user) and jwtHelper.isTokenExpired(user.token)
          e.preventDefault();
          $state.go 'login'
        else
          lastUpdate = moment(user.lastUpdate, 'DD-MM-YYYY')
          refreshTokenFlag = moment().isSame(moment(lastUpdate), 'day')

          if !refreshTokenFlag
            refreshToken()
            .then (data)->
              tokenData = data
              if !(_.isNull(tokenData.token) and _.isUndefined(tokenData.token))
                userObj =
                  id:tokenData.id
                  token: tokenData.token
                  username: tokenData.username
                  lastUpdate: moment().format('DD-MM-YYYY')
                store.set 'user', userObj
              else
                e.preventDefault()
                $state.go 'login'
            , (error)->
              e.preventDefault();

          else
            console.log 'in Sync'


]
.constant 'API',
  url: '../api/source/'
