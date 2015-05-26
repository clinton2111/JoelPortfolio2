angular.module 'joelDashBoard.DashCtrl'
.directive 'onFinishRender',['$timeout', ($timeout)->
  restrict: 'A',
  link: (scope, element, attrs)->
    if scope.$last is true
      $timeout ()->
        scope.$emit('$viewContentLoaded');

]