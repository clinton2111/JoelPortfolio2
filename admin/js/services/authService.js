angular.module('joelDashBoard.login').factory('Auth', [
  '$http', '$q', 'API', function($http, $q, API) {
    return {
      signIn: function(userCredentials) {
        var q;
        q = $q.defer();
        $http({
          url: API.url + 'login.php',
          method: 'POST',
          data: userCredentials,
          skipAuthorization: true
        }).then(function(data) {
          return q.resolve(data);
        }, function(error) {
          return q.reject(error);
        });
        return q.promise;
      },
      recoverPassword: function(emailData) {
        var q;
        emailData.type = 'recoverPassword';
        q = $q.defer();
        $http({
          url: API.url + 'mailer.php',
          method: 'POST',
          data: emailData,
          skipAuthorization: true
        }).then(function(data) {
          return q.resolve(data);
        }, function(error) {
          return q.reject(error);
        });
        return q.promise;
      },
      updatePassword: function(passwordData) {
        var q;
        passwordData.type = 'updatePassword';
        q = $q.defer();
        $http({
          url: API.url + 'mailer.php',
          method: 'POST',
          data: passwordData,
          skipAuthorization: true
        }).then(function(data) {
          return q.resolve(data);
        }, function(error) {
          return q.reject(error);
        });
        return q.promise;
      }
    };
  }
]);
