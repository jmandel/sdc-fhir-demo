'use strict';

angular.module('sdcApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
});

angular.module('sdcApp').service('Questionnaire', function($http){
  this.get = function(id, success, error){
    var ret = $http.get('fixtures/'+id+'.json')
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
