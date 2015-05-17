angular.module 'joelDashBoard.loginController', []
.controller 'loginController', ['$scope', ($scope)->
  $scope.forgotPassword = false
  $scope.viewPass = false
  $scope.passType = 'password'
  $scope.passIcon = 'mdi-action-visibility-off'
  $scope.toggleShowPassword = ()->
    if ($scope.viewPass is false)
      $scope.viewPass = true
      $scope.passType = 'text'
      $scope.passIcon = 'mdi-action-visibility'
    else
      $scope.viewPass = false
      $scope.passType = 'password'
      $scope.passIcon = 'mdi-action-visibility-off'

  $scope.login = ->
    console.log $scope.user

  $scope.recoverPassword = ->
    console.log $scope.recoveryEmail

  $scope.toggleForgotPass = ->
    if($scope.forgotPassword is false) then $scope.forgotPassword = true
    else $scope.forgotPassword = false
]