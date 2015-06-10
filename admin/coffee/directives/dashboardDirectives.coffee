angular.module 'joelDashBoard.DashCtrl'
.directive 'onFinishRender', ['$timeout', ($timeout)->
  restrict: 'A',
  link: (scope, element, attrs)->
    if scope.$last is true
      $timeout ()->
        if attrs['onFinishRender'] is 'Gigs'
          $ '.collapsible'
          .collapsible(
              accordion: false
          )
]

.directive 'googleplace', [()->
  require: 'ngModel'
  scope:
    ngModel: '='
    details: '=?'
  link: (scope, element, attrs, model) ->
    options =
      types: []
      componentRestrictions: {}
    scope.gPlace = new (google.maps.places.Autocomplete)(element[0], options)
    google.maps.event.addListener scope.gPlace, 'place_changed', ->
      scope.$apply ->
        scope.details = scope.gPlace.getPlace()
        model.$setViewValue element.val()
]
