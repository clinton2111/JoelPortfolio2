angular.module('joelDashBoard', ['ui.router', 'angular-jwt', 'angular-storage', 'joelDashBoard.login', 'joelDashBoard.DashCtrl', 'ngFileUpload']).config([
  '$stateProvider', '$urlRouterProvider', '$httpProvider', 'jwtInterceptorProvider', function($stateProvider, $urlRouterProvider, $httpProvider, jwtInterceptorProvider) {
    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'partials/login.html',
      controller: 'loginController'
    }).state('dashboard', {
      url: '/dashboard',
      abstract: true,
      templateUrl: 'partials/dashboard.html',
      controller: 'dashboardController',
      data: {
        requiresLogin: true
      }
    }).state('dashboard.home', {
      url: '',
      templateUrl: 'partials/home.html',
      data: {
        requiresLogin: true
      }
    }).state('dashboard.photos', {
      url: '/photos',
      templateUrl: 'partials/photos.html',
      data: {
        requiresLogin: true
      }
    }).state('dashboard.gigs', {
      url: '/gigs',
      templateUrl: 'partials/gigs.html',
      data: {
        requiresLogin: true
      }
    }).state('dashboard.account', {
      url: '/account',
      templateUrl: 'partials/account.html',
      data: {
        requiresLogin: true
      }
    });
    $urlRouterProvider.when('dashboard', 'dashboard.photos');
    $urlRouterProvider.otherwise('/login');
    jwtInterceptorProvider.tokenGetter = [
      'config', 'store', function(config, store) {
        var user;
        if (config.url.substr(config.url.length - 5) === '.html') {
          return null;
        } else {
          user = store.get('user');
          if (!(_.isNull(user.token)) || !(_.isUndefined(user.token))) {
            return config.headers.Authorization = user.token;
          }
        }
      }
    ];
    return $httpProvider.interceptors.push('jwtInterceptor');
  }
]).run([
  '$rootScope', '$state', 'store', 'jwtHelper', '$http', 'API', '$q', function($rootScope, $state, store, jwtHelper, $http, API, $q) {
    return $rootScope.$on('$stateChangeStart', function(e, to) {
      var lastUpdate, refreshToken, refreshTokenFlag, user;
      refreshToken = function() {
        var q;
        q = $q.defer();
        $http.post(API.url + 'refreshToken.php', null).then(function(data) {
          return q.resolve(data.data);
        }, function(error) {
          console.log('Error');
          return q.reject(data);
        });
        return q.promise;
      };
      user = store.get('user');
      if (to.data && to.data.requiresLogin) {
        if (_.isNull(user) || _.isUndefined(user) || jwtHelper.isTokenExpired(user.token)) {
          e.preventDefault();
          return $state.go('login');
        } else {
          lastUpdate = moment(user.lastUpdate, 'DD-MM-YYYY');
          refreshTokenFlag = moment().isSame(moment(lastUpdate), 'day');
          if (!refreshTokenFlag) {
            return refreshToken().then(function(data) {
              var tokenData, userObj;
              tokenData = data;
              if (!(_.isNull(tokenData.token) && _.isUndefined(tokenData.token))) {
                userObj = {
                  id: tokenData.id,
                  token: tokenData.token,
                  username: tokenData.username,
                  lastUpdate: moment().format('DD-MM-YYYY')
                };
                return store.set('user', userObj);
              } else {
                e.preventDefault();
                return $state.go('login');
              }
            }, function(error) {
              return e.preventDefault();
            });
          } else {

          }
        }
      }
    });
  }
]).constant('API', {
  url: '../api/source/'
});
