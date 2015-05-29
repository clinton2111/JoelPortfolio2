angular.module 'joelDashBoard.login', []
.controller 'loginController', ['$scope', 'Auth', 'jwtHelper', 'store', '$state',($scope, Auth, jwtHelper, store,$state)->
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
    Auth.signIn($scope.user)
    .then (data)->
      userData=data.data
      if userData.status is 'Error'
        Materialize.toast userData.message, '4000'
      else
        userObj =
          id:userData.id
          token: userData.token
          username: userData.username
          lastUpdate: moment().format('DD-MM-YYYY')
        store.set 'user', userObj
        Materialize.toast userData.message, '4000'
        $state.go 'dashboard.home'
    , (error)->
        Materialize.toast error.data.message, '4000'
    .finally ()->


  $scope.recoverPassword = ->
    console.log $scope.recoveryEmail

  $scope.toggleForgotPass = ->
    if($scope.forgotPassword is false) then $scope.forgotPassword = true
    else $scope.forgotPassword = false
]