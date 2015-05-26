angular.module('joelDashBoard.DashCtrl').directive('onFinishRender', [
  '$timeout', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        if (scope.$last === true) {
          return $timeout(function() {
            return scope.$emit('$viewContentLoaded');
          });
        }
      }
    };
  }
]);
