naplanApp.controller('RgModalCtrl', ['$scope', '$uibModalInstance','scores', 'dataService', '$sce', function ($scope, $uibModalInstance,scores, dataService, $sce) {

    $ctrl = this;
    $scope.high = 0;
    $scope.low = 0;
    $scope.average = 0;

    $scope.popOverTable = '';

    $scope.bandCols = [];

    $scope.dynamicPopover = {
    content: 'Hello, World!',
    templateUrl: '/partials/rg-popover.html',
    title: 'Title'
  };

    $ctrl.$onInit = function () {

      var studentRg = dataService.getRelativeGrowthProbabilities(scores.current,scores.previous,scores.domain,scores.year,scores.level);

      for(var i=0;i<studentRg.data.data.length;i++){
        if (studentRg.data.data[i].highGain == 1){
          $scope.high =  studentRg.data.data[i].confidence;
        }

        if (studentRg.data.data[i].averageGain == 1){
          $scope.average =  studentRg.data.data[i].confidence;
        }

        if (studentRg.data.data[i].lowGain == 1){
          $scope.low =  studentRg.data.data[i].confidence;
        }
      }
    };

}]);

naplanApp.controller('NaplanController', function($scope, dataService, $routeParams, naplanService, tableService, $uibModal, $sce) {

  $scope.html = 'Loading....';
  $scope.data = dataService.getData();

  $scope.tests = {};

  $scope.bandCols = [];

  $scope.currentPage = {page: 'home'};
  $scope.domainData = [];
  $scope.studentData = {};

  //Used for investigating how erro
  $scope.domain = {studentError : 0, testError : 0};
  $scope.student = {studentError : 0, testError : 0};
  $scope.cohort = {studentError : 0, testError : 0};
  $scope.relativeGrowth = {studentError : 0, testError : 0};
  $scope.testError = 0;
  $scope.StudentError = 0;

  $scope.cohortData = {};

  $scope.showReports = false;

  $scope.occurences = [];

  $scope.page = $routeParams.page;

  $scope.currentPage = {
    page: 'domain',
    domain: $routeParams.domain,
    level: $routeParams.level,
    year: $routeParams.year,
    question: $routeParams.question};

  switch ( $routeParams.page){

    case 'student-response-writing-question':
      $scope.school = dataService.getSchoolResponseToQuestion($routeParams.domain, $routeParams.year,$routeParams.level, $routeParams.question);

      $scope.questions = dataService.getStudentResponsesWriting($routeParams.year,$routeParams.level);

      for(var i=0;i<$scope.questions.length;i++){
        if ($scope.questions[i].question == $scope.currentPage.question){
          $scope.currentPage.skill = $scope.questions[i].skill;
          $scope.currentPage.maxScore = $scope.questions[i].scores.length -1;
        }
      }
      break;

    case 'student-response':
      $scope.questions = dataService.getStudentResponses($routeParams.domain, $routeParams.year,$routeParams.level);
      //console.log($scope.questions);
      break;

    case 'student-response-writing':
      $scope.questions = dataService.getStudentResponsesWriting($routeParams.year,$routeParams.level);
      //console.log($scope.questions);
      break;

    case 'student-response-question':
    /*
      if ($routeParams.domain == 'Grammar' ){
        var domainName = 'GRAMMAR & PUNCTUATION';
      } else {
        var domainName = $routeParams.domain;
      }

      */
      $scope.questions = dataService.getStudentResponses($routeParams.domain, $routeParams.year,$routeParams.level);
      //console.log($scope.questions);
      for( var i=0; i< $scope.questions.length;i++){
        if ( $scope.questions[i].question == $scope.currentPage.question){
          $scope.currentPage.skill = $scope.questions[i].skill;
          $scope.currentPage.dimension = $scope.questions[i].dimension;
          $scope.currentPage.word = $scope.questions[i].word;
          $scope.currentPage.schoolResult = $scope.questions[i].school;
          $scope.currentPage.stateResult = $scope.questions[i].state;
        }
      }
      //console.log('and here...');
      $scope.school = dataService.getSchoolResponseToQuestion($routeParams.domain, $routeParams.year,$routeParams.level, parseInt($routeParams.question));
      //console.log($scope.school);
      break;

    case 'domain':

        $scope.domainData = dataService.getDomainData($routeParams.domain, $routeParams.year,$routeParams.level,$scope.domain.testError,$scope.domain.studentError);
      break;

    case 'student':
      //console.log('here');
        $scope.currentPage = {
          page: 'student',
          domain: $routeParams.domain,
          level: $routeParams.level,
          year: $routeParams.year};
          $scope.studentData = dataService.getStudentData($routeParams.casesId, $routeParams.domain,$routeParams.level,$scope.student.testError,$scope.student.studentError);
        break;

    case 'matched-cohort-map':
      $scope.matchedTests = dataService.getMatchedTest($routeParams.domain,$routeParams.year,$routeParams.level,$scope.relativeGrowth.testError,$scope.relativeGrowth.studentError);

      $scope.bandCols = [];
      var band1 = 0;
      var band2 = 0;
      var band3 = 0;
      var band4 = 0;
      var band5 = 0;
      var band6 = 0;
      var band7 = 0;
      var band8 = 0;
      var band9 = 0;
      var band10 = 0;

      for(var i=0;i<$scope.matchedTests[0].length;i++){
        if ( parseInt($scope.matchedTests[0][i].currentScaledScore) <= 270){
          band1++;
        } else {
          if ( $scope.matchedTests[0][i].currentScaledScore <= 322){
              band2++;
          } else {
            if ( $scope.matchedTests[0][i].currentScaledScore <= 374){
              band3++;
            } else {
              if ( $scope.matchedTests[0][i].currentScaledScore <= 426){
                band4++;
              } else {
                if ( $scope.matchedTests[0][i].currentScaledScore <= 478){
                  band5++;
                } else {
                  if ( $scope.matchedTests[0][i].currentScaledScore <= 530){
                    band6++;
                  } else {
                    if ( $scope.matchedTests[0][i].currentScaledScore <= 582){
                      band7++;
                    } else {
                      if ( $scope.matchedTests[0][i].currentScaledScore <= 638){
                        band8++;
                      } else {
                        if ( $scope.matchedTests[0][i].currentScaledScore <= 686){
                          band9++;
                        } else {
                          band10++;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      $scope.updateRelativeGrowth = function(){

        //Update the relativeGrowth.ver content.
        for(var i=0;i<$scope.matchedTests.length;i++){
          for(var j=0;j<$scope.matchedTests[i].length;j++){
            //Update popovers.
            if ( $scope.matchedTests[i][j].students.length > 0){

              var studentRg = naplanService.getGrowthConfidences([{currentScore: $scope.matchedTests[i][j].currentScaledScore ,previousScore: $scope.matchedTests[i][j].previousScaledScore}], $scope.currentPage.domain, $scope.currentPage.year, $scope.currentPage.level, $scope.realativeGrowth.studentError.testError, $scope.realativeGrowth.studentError.studentError);
              var low = 0;
              var average = 0;
              var high = 0;

              for(var k=0;k<studentRg.data.data.length;k++){
              //  console.log(studentRg.data.data[k]);
                if (studentRg.data.data[k].highGain == 1){
                  high =  studentRg.data.data[k].confidence;
                }

                if (studentRg.data.data[k].averageGain == 1){
                  average =  studentRg.data.data[k].confidence;
                }

                if (studentRg.data.data[k].lowGain == 1){
                  low =  studentRg.data.data[k].confidence;
                }
              }
    //console.log('here');
              var html = '';
              for(var m=0;m<$scope.matchedTests[i][j].students.length;m++){
                html = html + '<div>'+$scope.matchedTests[i][j].students[m].surname+', '+$scope.matchedTests[i][j].students[m].firstName+'</div>';
              }
              html = html + '<div><table class="table table-bordered"><thead><th>Low</th><th>Average</th><th>High</th></thead><tbody><tr><td>'+low.toString()+'%</td><td>'+average.toString()+'%</td><td>'+high.toString()+'%</td></tbody></table></div>';

              $scope.matchedTests[i][j].popover = $sce.trustAsHtml(html);
            }
          }
        }
      };

      $scope.bandCols =[band1,band2,band3,band4,band5,band6,band7,band8,band9,band10];

      $scope.bandRows = [];
      var band1 = 0;
      var band2 = 0;
      var band3 = 0;
      var band4 = 0;
      var band5 = 0;
      var band6 = 0;
      var band7 = 0;
      var band8 = 0;
      var band9 = 0;
      var band10 = 0;


      for(var i=0;i<$scope.matchedTests.length;i++){
        if ( parseInt($scope.matchedTests[i][0].previousScaledScore) <= 270){
          band1++;
        } else {
          if ( $scope.matchedTests[i][0].previousScaledScore <= 322){
              band2++;
          } else {
            if ( $scope.matchedTests[i][0].previousScaledScore <= 374){
              band3++;
            } else {
              if ( $scope.matchedTests[i][0].previousScaledScore <= 426){
                band4++;
              } else {
                if ( $scope.matchedTests[i][0].previousScaledScore <= 478){
                  band5++;
                } else {
                  if ( $scope.matchedTests[i][0].previousScaledScore <= 530){
                    band6++;
                  } else {
                    if ( $scope.matchedTests[i][0].previousScaledScore <= 582){
                      band7++;
                    } else {
                      if ( $scope.matchedTests[i][0].previousScaledScore <= 638){
                        band8++;
                      } else {
                        if ( $scope.matchedTests[i][0].previousScaledScore <= 686){
                          band9++;
                        } else {
                          band10++;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      $scope.bandRows =[band1,band2,band3,band4,band5,band6,band7,band8,band9,band10];
      break;



    case 'matched-cohort':
      //console.log('here');
        $scope.currentPage = {
          page: $routeParams.page,
          domain: $routeParams.domain,
          level: $routeParams.level,
          year: $routeParams.year};
          $scope.cohortData = dataService.getMatchedCohort($routeParams.domain,$routeParams.year,$routeParams.level,$scope.student.testError,$scope.student.studentError);

          for(var i=0; i<$scope.cohortData.tests.length;i++){
            if ( $scope.cohortData.tests[i].test == "Relative Growth Confidence"){
              $scope.tests.relativeGrowth = $scope.cohortData.tests[i].data;

              $scope.tests.relativeGrowth.data.sort(function(a, b) {
                  return parseFloat(b.occurence) - parseFloat(a.occurence);
              });

              var low = 10000;
              var high = 0;

              for (var key in $scope.tests.relativeGrowth.occurences.lowGains){

                if (parseInt(key) < low){
                  low = parseInt(key);
                }

                if (parseInt(key) > high){
                  high = parseInt(key);
                }
              }

              for (var key in $scope.tests.relativeGrowth.occurences.highGains){
                if (parseInt(key) < low){
                  low = parseInt(key);
                }

                if (parseInt(key) > high){
                  high = parseInt(key);
                }
              }

              var highGain = 0;
              var averageGain = 0;
              var lowGain = 0;

              for(var j=low;j<high;j++){
                if ( $scope.tests.relativeGrowth.occurences.highGains[j] != undefined){
                  highGain = $scope.tests.relativeGrowth.occurences.highGains[j];
                }

                if ( $scope.tests.relativeGrowth.occurences.averageGains[j] != undefined){
                  averageGain =  $scope.tests.relativeGrowth.occurences.averageGains[j];
                }

                if (  $scope.tests.relativeGrowth.occurences.lowGains[j] != undefined){
                  lowGain =  $scope.tests.relativeGrowth.occurences.lowGains[j];
                }

                $scope.occurences.push({count: j,highGain: highGain, averageGain: averageGain, lowGain: lowGain});

              }

            }
          }
        break;

      case 'equivalence-table':
        $scope.currentPage = {
          domain : $routeParams.domain,
          year : $routeParams.year,
          level : $routeParams.level
        };
        $scope.dataTable = tableService.getEquivalenceTable($routeParams.domain, $routeParams.year, $routeParams.level);
        //console.log($scope.dataTable);
        break;

      case 'data-table':
          //Nothing to do

        break;

      case 'reports':
//console.log($scope.data);
          //Nothing to do

        break;

  };

  $scope.bandRowCell = function( index ){

    switch(index){
      case 0:
        return $scope.bandRows[0];
        break;

      case $scope.bandRows[0]:
        return $scope.bandRows[1];
        break;

      case ($scope.bandRows[0]+$scope.bandRows[1]):
        return $scope.bandRows[2];
        break;

      case ($scope.bandRows[2]+$scope.bandRows[1]+$scope.bandRows[0]):
        return $scope.bandRows[3];
        break;

      case ($scope.bandRows[3]+$scope.bandRows[2]+$scope.bandRows[1]+$scope.bandRows[0]):
        return $scope.bandRows[4];
        break;

      case ($scope.bandRows[4]+$scope.bandRows[3]+$scope.bandRows[2]+$scope.bandRows[1]+$scope.bandRows[0]):
        return $scope.bandRows[5];
        break;

      case ($scope.bandRows[5]+$scope.bandRows[4]+$scope.bandRows[3]+$scope.bandRows[2]+$scope.bandRows[1]+$scope.bandRows[0]):
        return $scope.bandRows[6];
        break;

      case ($scope.bandRows[6]+$scope.bandRows[5]+$scope.bandRows[4]+$scope.bandRows[3]+$scope.bandRows[2]+$scope.bandRows[1]+$scope.bandRows[0]):
        return $scope.bandRows[7];
        break;

      case ($scope.bandRows[7]+$scope.bandRows[6]+$scope.bandRows[5]+$scope.bandRows[4]+$scope.bandRows[3]+$scope.bandRows[2]+$scope.bandRows[1]+$scope.bandRows[0]):
        return $scope.bandRows[8];
        break;

      case ($scope.bandRows[8]+$scope.bandRows[7]+$scope.bandRows[6]+$scope.bandRows[5]+$scope.bandRows[4]+$scope.bandRows[3]+$scope.bandRows[2]+$scope.bandRows[1]+$scope.bandRows[0]):
        return $scope.bandRows[9];
        break;

      case ($scope.bandRows[9]+$scope.bandRows[8]+$scope.bandRows[7]+$scope.bandRows[6]+$scope.bandRows[5]+$scope.bandRows[4]+$scope.bandRows[3]+$scope.bandRows[2]+$scope.bandRows[1]+$scope.bandRows[0]):
        return $scope.bandRows[10];
        break;

      default:
        return 0;
        break;
    }
  };

  $scope.bandRowCellBand = function( index ){
    switch(index){
      case 0:
        return 1;
        break;

      case $scope.bandRows[0]:
        return 2;
        break;

      case ($scope.bandRows[0]+$scope.bandRows[1]):
        return 3;
        break;

      case ($scope.bandRows[2]+$scope.bandRows[1]+$scope.bandRows[0]):
        return 4;
        break;

      case ($scope.bandRows[3]+$scope.bandRows[2]+$scope.bandRows[1]+$scope.bandRows[0]):
        return 5;
        break;

      case ($scope.bandRows[4]+$scope.bandRows[3]+$scope.bandRows[2]+$scope.bandRows[1]+$scope.bandRows[0]):
        return 6;
        break;

      case ($scope.bandRows[5]+$scope.bandRows[4]+$scope.bandRows[3]+$scope.bandRows[2]+$scope.bandRows[1]+$scope.bandRows[0]):
        return 7;
        break;

      case ($scope.bandRows[6]+$scope.bandRows[5]+$scope.bandRows[4]+$scope.bandRows[3]+$scope.bandRows[2]+$scope.bandRows[1]+$scope.bandRows[0]):
        return 8;
        break;

      case ($scope.bandRows[7]+$scope.bandRows[6]+$scope.bandRows[5]+$scope.bandRows[4]+$scope.bandRows[3]+$scope.bandRows[2]+$scope.bandRows[1]+$scope.bandRows[0]):
        return 9;
        break;

      case ($scope.bandRows[8]+$scope.bandRows[7]+$scope.bandRows[6]+$scope.bandRows[5]+$scope.bandRows[4]+$scope.bandRows[3]+$scope.bandRows[2]+$scope.bandRows[1]+$scope.bandRows[0]):
        return 10;
        break;
    }

  };

  $scope.renderRgTableHTML = function(current,previous){
    var studentRg = dataService.getRelativeGrowthProbabilities(current,previous,$scope.currentPage.domain,$scope.currentPage.year,$scope.currentPage.level);
    //console.log(studentRg.data.data);

    var high = 0;
    var average = 0;
    var low = 0;

    for(var i=0;i<studentRg.data.data.length;i++){
    //  console.log(studentRg.data.data[i]);
      if (studentRg.data.data[i].highGain == 1){
        high =  studentRg.data.data[i].confidence;
      }

      if (studentRg.data.data[i].averageGain == 1){
        average =  studentRg.data.data[i].confidence;
      }

      if (studentRg.data.data[i].lowGain == 1){
        low =  studentRg.data.data[i].confidence;
      }
    }

    var html = '<table class="table table-bordered"><thead><th>Low</th><th>Average</th><th>High</th></thead><tbody><tr><td>'+low+'%</td><td>'+average+'%</td><td>'+high+'%</td></tbody></table>';

    return $sce.trustAsHtml(html);

  };

  $scope.renderAsHTML = function(html){

    return $sce.trustAsHtml(html);
  }


  $scope.showRelativeGrowthStudent = function(curent,previous){

    $scope.popover = {
      content: 'Hello, World!',
      templateUrl: '/partials/rg-popover.html',
      title: 'Title',
      high: 90
    };

    $scope.placement = {
      options: [
        'top',
        'top-left',
        'top-right',
        'bottom',
        'bottom-left',
        'bottom-right',
        'left',
        'left-top',
        'left-bottom',
        'right',
        'right-top',
        'right-bottom'
      ],
      selected: 'top'
    };

    $scope.htmlPopover = $sce.trustAsHtml('<b style="color: red">I can</b> have <div class="label label-success">HTML</div> content');

  };

  $scope.showRelativeGrowthStudentOld = function(curent,previous){

    var modalInstance = $uibModal.open({
      //to set this true, you will need to add ngAnimate module
      animation: false,
      templateUrl: '/partials/rg-modal.html',
      controller: 'RgModalCtrl',
      size: 'md',
      resolve: {
        scores: function () {
          return {
            current: curent,
            previous : previous,
            domain: $scope.currentPage.domain,
            year : $scope.currentPage.year,
            level : $scope.currentPage.level,
            testError : $scope.cohort.testError ,
            studentError : $scope.cohort.studentError };
        }
      }
    });
  };



  $scope.writingColWidth = function(cols){

    var width = Math.round(1 / cols.length * 100);
    var style = "width:"+width+"%;";

    return style;
  };

  $scope.nextSchoolQuestion = function(){

    var nextQuestion = parseInt($scope.currentPage.question)+ 1;

    var url = 'student-response/d/'+$scope.currentPage.domain+'/y/'+$scope.currentPage.year+'/l/'+$scope.currentPage.level+'/q/'+nextQuestion;

    return url;
  };

  $scope.sortrelativeGrowthData = function(col,direction){

    if ( direction == 'ASC'){
      $scope.tests.relativeGrowth.data.sort(function(a, b) {
          return parseFloat(b[col]) - parseFloat(a[col]);
      });
    } else {
      $scope.tests.relativeGrowth.data.sort(function(a, b) {
          return parseFloat(a[col]) - parseFloat(b[col]);
      });
    }

  };

  $scope.sortDomainData = function(col,direction){

    var sort_by = function(field, reverse, primer){

       var key = primer ?
           function(x) {return primer(x[field])} :
           function(x) {return x[field]};

       reverse = !reverse ? 1 : -1;

       return function (a, b) {
           return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
         }
    }

    switch(col){
      case "score":
      case "band":
      case "error":
        if ( direction == 'ASC'){
          $scope.domainData.sort(function(a, b) {
              return parseFloat(b[col]) - parseFloat(a[col]);
          });
        } else {
          $scope.domainData.sort(function(a, b) {
              return parseFloat(a[col]) - parseFloat(b[col]);
          });
        }
      break;


      case "surname":
        if ( direction == 'ASC'){
          $scope.domainData.sort(sort_by(col, true, function(a){return a.toUpperCase()}));
        } else {
          $scope.domainData.sort(sort_by(col, false, function(a){return a.toUpperCase()}));
        }
      break;
    }
  };


  $scope.sortQuestionData = function(col,direction){

    var sort_by = function(field, reverse, primer){

       var key = primer ?
           function(x) {return primer(x[field])} :
           function(x) {return x[field]};

       reverse = !reverse ? 1 : -1;

       return function (a, b) {
           return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
         }
    }

    switch(col){
      case "question":
      case "school":
      case "state":
      case "difference":
      case "difficulty":
        if ( direction == 'ASC'){
          $scope.questions.sort(function(a, b) {
              return parseFloat(b[col]) - parseFloat(a[col]);
          });
        } else {
          $scope.questions.sort(function(a, b) {
              return parseFloat(a[col]) - parseFloat(b[col]);
          });
        }
      break;


      case "dimension":
        if ( direction == 'ASC'){
          $scope.questions.sort(sort_by(col, true, function(a){return a.toUpperCase()}));
        } else {
          $scope.questions.sort(sort_by(col, false, function(a){return a.toUpperCase()}));
        }
      break;
    }
  };

  $scope.sortSchoolData = function(col,direction){

    var sort_by = function(field, reverse, primer){

       var key = primer ?
           function(x) {return primer(x[field])} :
           function(x) {return x[field]};

       reverse = !reverse ? 1 : -1;

       return function (a, b) {
           return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
         }
    }

    switch(col){
      case "score":
      case "testRawScore":
      case "testScaledScore":
        if ( direction == 'ASC'){
          $scope.school.sort(function(a, b) {
              return parseFloat(b[col]) - parseFloat(a[col]);
          });
        } else {
          $scope.school.sort(function(a, b) {
              return parseFloat(a[col]) - parseFloat(b[col]);
          });
        }
      break;


      case "surname":
        if ( direction == 'ASC'){
          $scope.school.sort(sort_by(col, true, function(a){return a.toUpperCase()}));
        } else {
          $scope.school.sort(sort_by(col, false, function(a){return a.toUpperCase()}));
        }
      break;
    }
  };

  $scope.hasQuestionData = function(year, level){
    var foundSet = false;

    for(var i=0; i<$scope.data.meta.length;i++){
        if ( $scope.data.meta[i].type == "Question Level"){
          //Only test outcome sets
          if (( parseInt($scope.data.meta[i].year) == parseInt(year)) && ( parseInt($scope.data.meta[i].level) == parseInt(level))){
            foundSet = true;
          }
        }
    }

    return foundSet;
  };

  $scope.hasOutcomesData = function(year, level){
    var foundSet = false;

    for(var i=0; i<$scope.data.meta.length;i++){
        if ( $scope.data.meta[i].type == "Outcomes Level"){
          //Only test outcome sets
          if (( parseInt($scope.data.meta[i].year) == parseInt(year)) && ( parseInt($scope.data.meta[i].level) == parseInt(level))){
            foundSet = true;
          }
        }
    }

    return foundSet;
  };

  $scope.hasRelativeGrowthReport = function(year,level){

    var foundCurrent = false;
    var foundPast = false;

    for(var i=0; i<$scope.data.meta.length;i++){
        if ( $scope.data.meta[i].type == "Outcomes Level"){
          //Only test outcome sets
          if (( parseInt($scope.data.meta[i].year) == parseInt(year)) && ( parseInt($scope.data.meta[i].level) == parseInt(level))){
            foundCurrent = true;
          }

          if (( parseInt($scope.data.meta[i].year) == (parseInt(year) -2)) && ( parseInt($scope.data.meta[i].level) == (parseInt(level) -2))){
            foundPast = true;
          }
        }
    }

    if ( (foundPast == true) && (foundCurrent == true) ){

      return true;
    } else {

      return false;
    }
  };

  $scope.hasFiveYearTrendReport = function(year,level){

    var foundYear1 = false;
    var foundYear2 = false;
    var foundYear3 = false;
    var foundYear4 = false;
    var foundYear5 = false;

    for(var i=0; i<$scope.data.meta.length;i++){
        if ( $scope.data.meta[i].type == "Outcomes Level"){
          //Only test outcome sets
          if (( parseInt($scope.data.meta[i].year) == parseInt(year)) && ( parseInt($scope.data.meta[i].level) == parseInt(level))){
            foundYear5 = true;
          }

          if (( parseInt($scope.data.meta[i].year) == (parseInt(year) -1)) && ( parseInt($scope.data.meta[i].level) == (parseInt(level) -1))){
            foundYear4 = true;
          }

          if (( parseInt($scope.data.meta[i].year) == (parseInt(year) -2)) && ( parseInt($scope.data.meta[i].level) == (parseInt(level) -2))){
            foundYear3 = true;
          }

          if (( parseInt($scope.data.meta[i].year) == (parseInt(year) -3)) && ( parseInt($scope.data.meta[i].level) == (parseInt(level) -3))){
            foundYear4 = true;
          }

          if (( parseInt($scope.data.meta[i].year) == (parseInt(year) -4)) && ( parseInt($scope.data.meta[i].level) == (parseInt(level) -4))){
            foundYear5 = true;
          }
        }
    }

    if ( (foundYear1 == true) && (foundYear2 == true) && (foundYear3 == true) && (foundYear4 == true) && (foundYear5 == true) ){

      return true;
    } else {

      return false;
    }
  };

  $scope.sortCohortData = function(col,direction){
    //FIXME: use a switch and direction

    var sort_by = function(field, reverse, primer){

       var key = primer ?
           function(x) {return primer(x[field])} :
           function(x) {return x[field]};

       reverse = !reverse ? 1 : -1;

       return function (a, b) {
           return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
         }
    }

    switch(col){
      case "previousScore":
      case "currentScore":
      case "difference":
        if ( direction == 'ASC'){
          $scope.cohortData.students.sort(function(a, b) {
              return parseFloat(b[col]) - parseFloat(a[col]);
          });
        } else {
          $scope.cohortData.students.sort(function(a, b) {
              return parseFloat(a[col]) - parseFloat(b[col]);
          });
        }
      break;


      case "surname":
      case "class":
      case "gain":
        if ( direction == 'ASC'){
          $scope.cohortData.students.sort(sort_by(col, true, function(a){return a.toUpperCase()}));
        } else {
          $scope.cohortData.students.sort(sort_by(col, false, function(a){return a.toUpperCase()}));
        }
      break;
    }
  };


  $scope.updateDomain = function(){

    $scope.domainData = dataService.getDomainData($routeParams.domain, $routeParams.year,$routeParams.level,$scope.domain.testError,$scope.domain.studentError);
  };

  function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  $scope.proper = function(str){
    return toTitleCase(str);
  }



  $scope.updateStudent = function(){

    $scope.studentData = dataService.getStudentData($routeParams.casesId, $routeParams.domain,$routeParams.level,$scope.student.testError,$scope.student.studentError);
  };
});
