angular.module 'joelPortfolio.directives',[]
.directive 'logoSvg',['$parse', '$compile',($parse, $compile)->
  restrict:'E'
  scope:
    svgid:'@'
  template:'<div id={{svgid}}></div>'
  replace:true

  link:(scope,attrs,elem)->
    myId = scope.svgid
    if myId is 'headerLogo'
      s=Snap('#headerLogo')
      Snap.load '../assets/images/joellogo.svg',(svgData)->
        s.append(svgData)
    else if myId is 'menuLogo'
      s=Snap('#menuLogo')
      Snap.load '../assets/images/joellogo.svg',(svgData)->
        s.append(svgData)



]