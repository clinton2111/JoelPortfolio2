angular.module('joelDashBoard.DashCtrl').directive('onFinishRender', [
  '$timeout', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        if (scope.$last === true) {
          return $timeout(function() {
            if (attrs['onFinishRender'] === 'Gigs') {
              return $('.collapsible').collapsible({
                accordion: false
              });
            }
          });
        }
      }
    };
  }
]).directive('googleplace', [
  function() {
    return {
      require: 'ngModel',
      scope: {
        ngModel: '=',
        details: '=?'
      },
      link: function(scope, element, attrs, model) {
        var options;
        options = {
          types: [],
          componentRestrictions: {}
        };
        scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
        return google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
          return scope.$apply(function() {
            scope.details = scope.gPlace.getPlace();
            return model.$setViewValue(element.val());
          });
        });
      }
    };
  }
]);
