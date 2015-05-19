angular.module('joelDashBoard.login').factory('Auth', [
  '$http', '$q', 'API', function($http, $q, API) {
    return {
      signIn: function(userCredentials) {
        var q;
        q = $q.defer();
        $http({
          url: API.url + 'login.php',
          method: 'POST',
          data: userCredentials
        }).then(function(data) {
          return q.resolve(data.data);
        }, function(error) {
          return q.reject(data);
        });
        return q.promise;
      }
    };
  }
]);
