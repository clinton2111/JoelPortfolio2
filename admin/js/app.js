angular.module('joelDashBoard', ['ui.router', 'angular-jwt', 'angular-storage', 'joelDashBoard.login']).config([
  '$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'partials/login.html',
      controller: 'loginController'
    }).state('dashboard', {
      url: '/dashboard',
      templateUrl: 'partials/dashboard.html',
      data: {
        requiresLogin: true
      }
    });
    return $urlRouterProvider.otherwise('/login');
  }
]).run([
  '$rootScope', '$state', 'store', 'jwtHelper', '$http', 'API', '$q', function($rootScope, $state, store, jwtHelper, $http, API, $q) {
    return $rootScope.$on('$stateChangeStart', function(e, to) {
      var lastUpdate, refreshToken, refreshTokenFlag, user;
      refreshToken = function(token) {
        var q;
        q = $q.defer();
        $http.post(API.url + 'refreshToken.php', token).then(function(data) {
          console.log(data);
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
            return refreshToken(user.token).then(function(data) {
              var tokenData, userObj;
              tokenData = data;
              userObj = {
                token: tokenData.token,
                username: tokenData.username,
                lastUpdate: moment().format('DD-MM-YYYY')
              };
              return store.set('user', userObj);
            }, function(error) {
              return e.preventDefault();
            });
          } else {
            return console.log('in Sync');
          }
        }
      }
    });
  }
]).constant('API', {
  url: '../api/source/'
});
