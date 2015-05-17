angular.module('joelDashBoard.loginController', []).controller('loginController', [
  '$scope', function($scope) {
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
      return console.log($scope.user);
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
