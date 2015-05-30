angular.module 'joelDashBoard.login', []
.controller 'loginController', ['$scope', 'Auth', 'jwtHelper', 'store', '$state', '$stateParams', 'md5',
  ($scope, Auth, jwtHelper, store, $state, $stateParams, md5)->
    if $stateParams.type is 'recovery' and !_.isUndefined($stateParams.value) and !_.isUndefined($stateParams.email)
      $scope.recovery_screen = true
      $scope.header = 'Reset Password'
    else
      $scope.recovery_screen = false
      $scope.header = 'Login'


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

    $scope.login = (user) ->
      data =
        email: user.email
        password: md5.createHash(user.password || '')

      Auth.signIn(data)
      .then (data)->
        userData = data.data
        if userData.status is 'Error'
          Materialize.toast userData.message, '4000'
        else
          userObj =
            id: userData.id
            token: userData.token
            username: userData.username
            lastUpdate: moment().format('DD-MM-YYYY')
          store.set 'user', userObj
          Materialize.toast userData.message, '4000'
          $state.go 'dashboard.home'
      , (error)->
        Materialize.toast error.data.message, '4000'
      .finally ()->


    $scope.recoverPassword = (recovery)->
      console.log recovery
      Auth.recoverPassword recovery
      .then (data)->
        response = data.data
        console.log response
        Materialize.toast response.message, 4000
      , (error)->
        Materialize.toast error.data.message, 4000

    $scope.toggleForgotPass = ->
      if($scope.forgotPassword is false)
        $scope.forgotPassword = true
        $scope.header = 'Recover Password'
      else
        $scope.forgotPassword = false
        $scope.header = 'Login'

    $scope.updatePassword = (new_pass) ->
      if new_pass.password is new_pass.cpassword
        data =
          password: md5.createHash(new_pass.password || '')
          email: $stateParams.email
          value: $stateParams.value
        Auth.updatePassword(data)
        .then (data)->
          response = data.data
          Materialize.toast response.status + ' - ' + response.message, 4000
          $state.go 'auth', {type: 'login', email: null, value: null}
        , (error)->
          Materialize.toast('Opps something went wrong', 4000)
      else
        Materialize.toast('Passwords do not match', 4000)

]