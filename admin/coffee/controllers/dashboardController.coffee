angular.module 'joelDashBoard.DashCtrl', []
.controller 'dashboardController', ['$scope','store' ,'API',($scope,store,API)->
  onLoadComplete = ()->
    $ ".button-collapse"
    .sideNav();
    $ '.materialboxed'
    .materialbox();

  $scope.$on('$viewContentLoaded', onLoadComplete);

  $scope.user=store.get 'user'
  $scope.dpUrl=API.url+'pic.php?id='+$scope.user.id+'&&from=users'
]