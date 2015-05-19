angular.module 'joelDashBoard.login', []
.controller 'loginController', ['$scope', 'Auth', 'jwtHelper', 'store', ($scope, Auth, jwtHelper, store)->
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
    .then (userdata)->
      if userdata.status is 'Error'
        Materialize.toast userdata.message, '4000'
      else
        userObj =
          token: userdata.token
          username: userdata.username
          lastUpdate: moment().format('DD-MM-YYYY')
        store.set 'user', userObj
        console.log store.get 'user'
        Materialize.toast userdata.message, '4000'
    , (error)->
      console.log 'Error'
    .finally ()->


  $scope.recoverPassword = ->
    console.log $scope.recoveryEmail

  $scope.toggleForgotPass = ->
    if($scope.forgotPassword is false) then $scope.forgotPassword = true
    else $scope.forgotPassword = false
]