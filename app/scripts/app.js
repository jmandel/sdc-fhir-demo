'use strict';

angular.module('sdcApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
.config(function ($routeProvider) {
  $routeProvider
  .when('/view/:fixture', {
    redirectTo: function($routeParams) {
      return '/view?q=fixtures/'+$routeParams.fixture+'.json';
    }
  })
  .when('/view', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
  .otherwise({
    redirectTo: '/view/example'
  });
});

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function relative(url){
  return (window.location.protocol + "//" + window.location.host + window.location.pathname).match(/(.*\/)[^\/]*/)[1] + url;
}


angular.module('sdcApp').service('smart', function($q, $http){
  return FHIR.client({
    serviceUrl: 'http://fake'
  });
});

angular.module('sdcApp').service('Questionnaire', function($http){
  this.get = function(q, success, error){
    var ret = $http.get(q)
    success && ret.success(success);
    error && ret.error(error);
    return ret;
  };
});

angular.module('sdcApp').directive('group', function($compile, $timeout){
  return {
    restrict: 'E',
    templateUrl: 'views/group.html',
    compile: function(tElement, tAttr, transclude) {
      var contents = tElement.contents().remove();
      var compiledContents;
      return function(scope, iElement, iAttr) {
        if(!compiledContents) {
          compiledContents = $compile(contents, transclude);
        }
        compiledContents(scope, function(clone, scope) {
          iElement.append(clone); 
        });
        scope.top =  (iAttr.top !== undefined);
      };
    }
  };
});

angular.module('sdcApp').directive('question', function(){
  return {
    restrict: 'E',
    templateUrl: 'views/question.html'
  };
});
