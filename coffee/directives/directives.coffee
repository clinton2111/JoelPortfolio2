angular.module 'joelPortfolio.directives',[]
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