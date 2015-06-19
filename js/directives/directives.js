angular.module('joelPortfolio').directive('onFinishRender', [
  '$timeout', function($timeout) {
    return {
      restrict: 'A',
      priority: 999,
      link: function(scope, element, attrs) {
        if (scope.$last === true) {
          return $timeout(function() {
            if (attrs['onFinishRender'] === 'Photos') {
              return $('.materialboxed').materialbox();
            }
          });
        }
      }
    };
  }
]);
