angular.module('joelPortfolio.directives', []).directive('logoSvg', [
  '$parse', '$compile', function($parse, $compile) {
    return {
      restrict: 'E',
      scope: {
        svgid: '@'
      },
      template: '<div id={{svgid}}></div>',
      replace: true,
      link: function(scope, attrs, elem) {
        var myId, s;
        myId = scope.svgid;
        if (myId === 'headerLogo') {
          s = Snap('#headerLogo');
          return Snap.load('../assets/images/joellogo.svg', function(svgData) {
            return s.append(svgData);
          });
        } else if (myId === 'menuLogo') {
          s = Snap('#menuLogo');
          return Snap.load('../assets/images/joellogo.svg', function(svgData) {
            return s.append(svgData);
          });
        }
      }
    };
  }
]);
