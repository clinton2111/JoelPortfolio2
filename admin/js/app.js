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
  '$rootScope', '$state', 'store', 'jwtHelper', function($rootScope, $state, store, jwtHelper) {
    return $rootScope.$on('$stateChangeStart', function(e, to) {
      var lastUpdate, refreshTokenFlag, user;
      user = store.get('user');
      if (to.data && to.data.requiresLogin) {
        user = store.get('user');
        if (_.isNull(user) || _.isUndefined(user) || jwtHelper.isTokenExpired(user.token)) {
          e.preventDefault();
          return $state.go('login');
        } else {
          lastUpdate = moment(user.lastUpdate, 'DD-MM-YYYY');
          refreshTokenFlag = moment().isSame(moment(lastUpdate), 'day');
          if (!refreshTokenFlag) {
            return console.log('Token needs to be Refreshed');
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
