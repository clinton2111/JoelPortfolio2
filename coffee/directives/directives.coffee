angular.module 'joelPortfolio'
.directive 'onFinishRender', ['$timeout', ($timeout)->
  restrict: 'A',
  priority: 999
  link: (scope, element, attrs)->
    if scope.$last is true
      $timeout ()->
        if attrs['onFinishRender'] is 'Photos'
          $ '.materialboxed'
          .materialbox()


]