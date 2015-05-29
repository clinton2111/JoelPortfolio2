angular.module('joelDashBoard.login', []).controller('loginController', [
  '$scope', 'Auth', 'jwtHelper', 'store', '$state', function($scope, Auth, jwtHelper, store, $state) {
    $scope.forgotPassword = false;
    $scope.viewPass = false;
    $scope.passType = 'password';
    $scope.passIcon = 'mdi-action-visibility-off';
    $scope.toggleShowPassword = function() {
      if ($scope.viewPass === false) {
        $scope.viewPass = true;
        $scope.passType = 'text';
        return $scope.passIcon = 'mdi-action-visibility';
      } else {
        $scope.viewPass = false;
        $scope.passType = 'password';
        return $scope.passIcon = 'mdi-action-visibility-off';
      }
    };
    $scope.login = function() {
      return Auth.signIn($scope.user).then(function(data) {
        var userData, userObj;
        userData = data.data;
        if (userData.status === 'Error') {
          return Materialize.toast(userData.message, '4000');
        } else {
          userObj = {
            id: userData.id,
            token: userData.token,
            username: userData.username,
            lastUpdate: moment().format('DD-MM-YYYY')
          };
          store.set('user', userObj);
          Materialize.toast(userData.message, '4000');
          return $state.go('dashboard.home');
        }
      }, function(error) {
        return Materialize.toast(error.data.message, '4000');
      })["finally"](function() {});
    };
    $scope.recoverPassword = function() {
      return console.log($scope.recoveryEmail);
    };
    return $scope.toggleForgotPass = function() {
      if ($scope.forgotPassword === false) {
        return $scope.forgotPassword = true;
      } else {
        return $scope.forgotPassword = false;
      }
    };
  }
]);
