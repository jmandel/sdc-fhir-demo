'use strict';

angular.module('sdcApp')
.controller('MainCtrl', function ($scope, Questionnaire) {
  Questionnaire.get('example', function(data){
    $scope.questionnaire = data;
    $scope.group = data.group;
  });

  $scope.allAnswers = function(){
    if (!$scope.questionnaire) return [];
    var ret = [];
    ans(ret, $scope.questionnaire.group);

    function ans(ret, g){
      if (!g) return;
      g.question && g.question.forEach(function(q){
        q.responses && q.responses[0] && q.responses[0].text && ret.push(q.responses[0].text);
        q.group && q.group.forEach(function(g){ans(ret, g)});
      });
      g.group && g.group.forEach(function(g){ans(ret,g)});
    };

    return ret;
  }

});

angular.module('sdcApp')
.controller('QuestionController', function ($scope, Questionnaire) {
  console.log("newqc", $scope.question);
  $scope.question.responses = [{}];
});
 
