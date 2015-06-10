angular.module('joelPortfolio').directive('scrollTo', [
  '$location', '$anchorScroll', function($location, $anchorScroll) {
    return function(scope, element, attrs) {
      return element.bind('click', function(event) {
        var location, point;
        event.stopPropagation();
        point = scope.$on('$locationChangeStart()', function(ev) {
          point();
          return ev.preventDefault();
        });
        location = attrs.scrollTo;
        $location.hash(location);
        return $anchorScroll();
      });
    };
  }
]).directive('onFinishRender', [
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
