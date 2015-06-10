angular.module('joelDashBoard.DashCtrl').factory('Insert', [
  'Upload', '$http', '$q', 'API', function(Upload, $http, $q, API) {
    return {
      uploadPhoto: function(picData) {
        var q;
        q = $q.defer();
        Upload.upload({
          url: API.url + 'insert.php',
          data: {
            'caption': picData.Caption,
            'location': 'photos'
          },
          method: 'post',
          headers: {
            'Content-Type': picData.File[0].type
          },
          file: picData.File[0]
        }).then(function(data) {
          return q.resolve(data);
        }, function(error) {
          return q.reject(error);
        });
        return q.promise;
      },
      uploadGig: function(data, file) {
        var q;
        data.location = 'gigs';
        q = $q.defer();
        Upload.upload({
          url: API.url + 'insert.php',
          data: data,
          method: 'post',
          headers: {
            'Content-Type': file.type
          },
          file: file
        }).then(function(data) {
          return q.resolve(data);
        }, function(error) {
          return q.reject(error);
        });
        return q.promise;
      }
    };
  }
]).factory('Search', [
  '$http', '$q', 'API', function($http, $q, API) {
    return {
      fetchPhotos: function() {
        var q;
        q = $q.defer();
        $http({
          url: API.url + 'search.php',
          data: {
            'location': 'photos'
          },
          method: 'post'
        }).then(function(data) {
          return q.resolve(data);
        }, function(error) {
          return q.reject(error);
        });
        return q.promise;
      },
      fetchGigs: function() {
        var q;
        q = $q.defer();
        $http({
          url: API.url + 'search.php',
          data: {
            'location': 'gigs'
          },
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
]).factory('Update', [
  '$http', '$q', 'API', 'Upload', function($http, $q, API, Upload) {
    return {
      updateCaption: function(data) {
        var q;
        data.location = 'photos';
        q = $q.defer();
        $http({
          url: API.url + 'update.php',
          data: data,
          method: 'post'
        }).then(function(data) {
          return q.resolve(data);
        }, function(error) {
          return q.reject(error);
        });
        return q.promise;
      },
      updateGigPoster: function(data, file) {
        var q;
        data.location = 'gigPoster';
        q = $q.defer();
        Upload.upload({
          url: API.url + 'update.php',
          data: data,
          method: 'post',
          headers: {
            'Content-Type': file.type
          },
          file: file
        }).then(function(data) {
          return q.resolve(data);
        }, function(error) {
          return q.reject(error);
        });
        return q.promise;
      },
      updateGigInfo: function(data) {
        var q;
        data.location = 'gigs';
        data.updateType = 'info';
        q = $q.defer();
        $http({
          url: API.url + 'update.php',
          data: data,
          method: 'post'
        }).then(function(data) {
          return q.resolve(data);
        }, function(error) {
          return q.reject(error);
        });
        return q.promise;
      },
      updatePassword: function(data) {
        var q;
        data.location = 'password';
        q = $q.defer();
        $http({
          url: API.url + 'update.php',
          data: data,
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
]).factory('Delete', [
  '$http', '$q', 'API', function($http, $q, API) {
    return {
      deletePhoto: function(data) {
        var q;
        data.location = 'photos';
        q = $q.defer();
        $http({
          url: API.url + 'delete.php',
          data: data,
          method: 'post'
        }).then(function(data) {
          return q.resolve(data);
        }, function(error) {
          return q.reject(error);
        });
        return q.promise;
      },
      deleteGig: function(data) {
        var q;
        data.location = 'gigs';
        q = $q.defer();
        $http({
          url: API.url + 'delete.php',
          data: data,
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
