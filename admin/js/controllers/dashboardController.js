angular.module('joelDashBoard.DashCtrl', []).controller('dashboardController', [
  '$scope', 'store', 'API', function($scope, store, API) {
    var onLoadComplete;
    onLoadComplete = function() {
      $(".button-collapse").sideNav();
      return $('.materialboxed').materialbox();
    };
    $scope.$on('$viewContentLoaded', onLoadComplete);
    $scope.user = store.get('user');
    return $scope.dpUrl = API.url + 'pic.php?id=' + $scope.user.id + '&&from=users';
  }
]);
