'use strict';

angular.module('sdcApp')
.controller('MainCtrl', function ($scope, $routeParams, Questionnaire, smart) {
  console.log($routeParams);
  Questionnaire.get($routeParams.q, function(data){
    $scope.questionnaire = data;
    $scope.group = data.group;
    console.log("Q", $scope.questionnaire);
  });

  $scope.allAnswers = function(){
    if (!$scope.questionnaire) return [];
    var ret = [];
    ans(ret, $scope.questionnaire.group);

    function ans(ret, g){
      if (!g) return;
      g = JSON.parse(JSON.stringify(g));
      g.question && g.question.forEach(function(q){
        if (q.responses) {
          if (q.responses.text && (q.responses.text.length === 0 || (
            q.responses.text[0]==="" && q.responses.text.length ===1
          )))
          delete q.responses.text;
          if (Object.keys(q.responses).length > 0) {
            q.responses.q = q.text;
            ret.push(q.responses);
          }
        }
        q.group && q.group.forEach(function(g){ans(ret, g)});
      });
      g.group && g.group.forEach(function(g){ans(ret,g)});
    };

    return ret;
  }

});

//TODO: service
var htmlInputTypeFor = {
  "string": "text",
  "decimal": "number",
  "integer": "number",
  "date": "date",
  "dateTime": "datetime"
};


function oneExt(name, type, fallback, fhirObj){
  var ret = fallback;
  if (fhirObj.extension){
    var matches = fhirObj.extension.filter(function(x){return x.url==name});
      if (matches.length === 1) {
        ret = matches[0]["value"+type[0].toUpperCase() + type.slice(1)];
      }
  }
  return ret;
}

function extMatch(name, type, value, fhirObj){
  if (fhirObj.extension){
    var matches = fhirObj.extension.filter(function(x){
      return x.url==name && x["value"+type[0].toUpperCase() + type.slice(1)] == value;
    });
    return matches.length > 0;
  }
  return false;
}


angular.module('sdcApp')
.controller('QuestionController', function ($scope, Questionnaire, smart) {

  var questionnaire = $scope.questionnaire;
  var q = $scope.question;

  $scope.options = [];

  var answerType = oneExt("http://hl7.org/fhir/questionnaire-extensions#answerFormat", "code", "string", q);
  $scope.inputType = htmlInputTypeFor[answerType];
  $scope.multiline = oneExt("http://tcm7.com.au/fhir#multiline", "boolean", false, q);

  $scope.multiple = oneExt("http://sdc/multipleCardinality", "boolean", false, q);

  var single = true;
  single = extMatch("http://hl7.org/fhir/questionnaire-extensions#answerFormat", "code", "single-choice", q);

  if (single) {
    $scope.multiple = false;
  }

  $scope.question.responses = {text: []}

  var optionsVs = null;

  if (q.options && q.options.reference){
    try {
      optionsVs = smart.cachedLink(questionnaire, q.options);
    } catch (e){
      console.log("couldn't find valueset " + q.options.reference);
    }
    console.log("Options from", q.options.reference, $scope.options);
  }

  if (optionsVs !== null){
    optionsVs.expansion && optionsVs.expansion.contains && optionsVs.expansion.contains.forEach(function(o){
      $scope.options.push(o); 
    });
    optionsVs.define && optionsVs.define.concept && optionsVs.define.concept.forEach(function(o){
      $scope.options.push(o); 
    });
  }

});
