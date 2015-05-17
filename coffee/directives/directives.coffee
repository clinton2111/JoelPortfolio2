angular.module 'joelPortfolio'
.directive 'scrollTo',['$location', '$anchorScroll',($location, $anchorScroll)->
  (scope, element, attrs)->
    element.bind 'click',(event)->
      event.stopPropagation();
      point=scope.$on '$locationChangeStart()',(ev)->
        point()
        ev.preventDefault()
      location=attrs.scrollTo;
      $location.hash location
      $anchorScroll()
]
.directive 'onFinishRender',['$timeout', ($timeout)->
  restrict: 'A',
  link: (scope, element, attrs)->
    if scope.$last is true
      $timeout ()->
        scope.$emit('$viewContentLoaded');

]