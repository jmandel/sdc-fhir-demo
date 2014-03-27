'use strict';

angular.module('sdcApp')
  .controller('MainCtrl', function ($scope, Questionnaire) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    Questionnaire.get('example', function(data){
      $scope.questionnaire = data;
      $scope.group = data.group;
    });
  });
