angular.module('joelDashBoard.login', []).controller('loginController', [
  '$scope', 'Auth', 'jwtHelper', 'store', function($scope, Auth, jwtHelper, store) {
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
      return Auth.signIn($scope.user).then(function(userdata) {
        var userObj;
        if (userdata.status === 'Error') {
          return Materialize.toast(userdata.message, '4000');
        } else {
          userObj = {
            token: userdata.token,
            username: userdata.username,
            lastUpdate: moment().format('DD-MM-YYYY')
          };
          store.set('user', userObj);
          return Materialize.toast(userdata.message, '4000');
        }
      }, function(error) {
        return console.log('Error');
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
