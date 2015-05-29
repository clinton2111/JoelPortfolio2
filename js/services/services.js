angular.module('joelPortfolio').factory('mainServices', [
  '$http', '$q', 'API', function($http, $q, API) {
    return {
      getGigs: function(offset) {
        var q;
        q = $q.defer();
        $http({
          url: API.url + 'public.php',
          data: {
            offset: offset,
            fetch: 'gigs'
          },
          method: 'POST'
        }).then(function(data) {
          return q.resolve(data);
        }, function(error) {
          return q.reject(error);
        });
        return q.promise;
      },
      getPics: function(offset) {
        var q;
        q = $q.defer();
        $http({
          url: API.url + 'public.php',
          data: {
            offset: offset,
            fetch: 'photos'
          },
          method: 'POST'
        }).then(function(data) {
          return q.resolve(data);
        }, function(error) {
          return q.reject(error);
        });
        return q.promise;
      },
      sendEmail: function(emailData) {
        var q;
        emailData.type = 'contact';
        q = $q.defer();
        $http({
          url: API.url + 'mailer.php',
          data: emailData,
          method: 'post'
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
