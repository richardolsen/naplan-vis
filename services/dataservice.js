"use strict";

naplanApp.service('dataService', function (localStorageService, naplanService, cacheService, tableService, $sce ) {
  /*
  Use to store, retrieve and manipulate data from CSV files.
  Note: data is only stored in the browser menu or the localStorage of the browser
  data nevers leaves your browser and is never transferred to any other server or service.
  Your data is never viewed or available anywhere but your device.
  */

  //The initial data model
  var hasData = false;

  var useLS = false;

  function usingLocalStorage(){
    var useLS = localStorageService.get('useLS');
    if( useLS == null ){
      localStorageService.set('useLS',true);
      useLS = true;
    }

    switch(useLS){
      case true:
      case 'true':
        return true;

      default:
        return false;
    }

  };


  function useLocalStorage(){
    localStorageService.set('useLS',true);
  };

  function deleteLocalStorage(){
    localStorageService.set('useLS',false);
    localStorageService.set('data','')

  };


  var data = angular.fromJson(localStorageService.get('data'));
  if ( data === null){
    data = {sets:[],meta:[],totals:{}};

  } else {
    if ( data.sets.length > 0){
      hasData = true;
    }
  }


  function toTitleCase(str){
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  function compare(val1, val2,cType){

    if ( val1 == val2){
      return true;
    }

    if ( cType == 'string'){
      if ( val1.toLowerCase() == val2.toLowerCase()){
        return true;
      }
    }

    if ( cType == 'number'){
      if ( parseInt(val1) == parseInt(val2)){
        return true;
      }
    }

    if (( val1.toLowerCase() == 'grammar') && ( val2.toLowerCase() == 'gp') ){
      return true;
    }

    //GRAMMAR & PUNCTUATION
    if (( val1 == 'Grammar') && ( val2 == 'GRAMMAR & PUNCTUATION') ){
      return true;
    }

    if (( val2 == 'Grammar') && ( val1 == 'GRAMMAR & PUNCTUATION') ){
      return true;
    }

    if (( val1.toLowerCase() == 'grammar') && ( val2.toLowerCase() == 'grammar & punctuation') ){
      return true;
    }

    if (( val2.toLowerCase() == 'grammar') && ( val1.toLowerCase() == 'gp') ){
      return true;
    }

    if (( val2.toLowerCase() == 'grammar') && ( val1.toLowerCase() == 'grammar & punctuation') ){
      return true;
    }

    //console.log('val1: '+val1+', val2:'+val2);

    return false;
  }

  function getColumn(heading,arr){

    var found = false;
    for(var i=0;i<arr.length;i++){
      if(arr[i] == heading ){
        found = i;
      }
    }

    return found;
  }


  function getDomainHeading( domain ){

    switch(domain){
      case "Numeracy":
        return "NUMERACY_nb";
        break;

      case "Reading":
        return "READING_nb";
        break;

      case "Spelling":
        return "SPELLING_nb";
        break;

      case "Grammar and Punctuation":
        return "GRAMMAR & PUNCTUATION_nb";
        break;

      case "Writing":
        return "WRITING_nb";
        break;

      default:
        return false;
        break;
    }
  }

  function getDomainIndex(domain,yearIndex,levelIndex){
    var index = false;
    for(var i=0;i<data.totals.levels[levelIndex].years[yearIndex].domains.length;i++){
      if ( domain == data.totals.levels[levelIndex].years[yearIndex].domains[i].domain){
        index = i;
      }
    }

    if (index === false){
      var domainObj = {domain:domain,students:0};
      data.totals.levels[levelIndex].years[yearIndex].domains.push(domainObj);

      return getDomainIndex(domain,yearIndex,levelIndex);
    } else {
      return index;
    }
  }

  function getYearIndex(year,levelIndex){
    var index = false;
    for(var i=0;i< data.totals.levels[levelIndex].years.length;i++){
      if ( parseInt(year) == parseInt(data.totals.levels[levelIndex].years[i].year)){
        index = i;
      }
    }

    if (index === false){
      var yearObj = {year:year,domains:[]};
      data.totals.levels[levelIndex].years.push(yearObj);

      return getYearIndex(year,levelIndex);
    } else {
      return index;
    }
  }

   function getLevelIndex (level){
    var index = false;

    if (typeof data.totals.levels == 'undefined' ){
      data.totals.levels = [];
    }

    for(var i=0;i<data.totals.levels.length;i++){
      if ( parseInt(level) == parseInt(data.totals.levels[i].level)){
        index = i;
      }
    }

    if (index === false){
      var levelObj = {level:level,years:[]};
      data.totals.levels.push(levelObj);

      return getLevelIndex(level);
    } else {
      return index;
    }
  }

  function parseData(set, fileName){
    //FIXME: Identify the type of data set.
    //If heading contains a *_nd column it is an outcomes data set, if "student score" it is a question level data set.
console.log('parseData');
    data.sets.push(set);

    hasData = true;

    var year = false;
    var level = false;
    var numeracyCol = false;
    var readingCol = false;
    var spellingCol = false;
    var grammarCol = false;
    var writingCol = false;

    var studentScoreCol = false;

    var dataSetType = false;


      for(var j=0; j<set[0].length;j++){
        if ( set[0][j] == "APS Year"){
          //Assume the second row is data!
          year = set[1][j];
        }

        if ( set[0][j] == "Reporting Test"){
          //Assume the second row is data!
          if ( set[1][j] == 'YR3P'){
            level = 3;
          }

          if ( set[1][j] == 'YR5P'){
            level = 5;
          }

          if ( set[1][j] == 'YR7P'){
            level = 7;
          }

          if ( set[1][j] == 'YR9P'){
            level = 9;
          }
        }

        //Get the index of the columns
        if ( set[0][j] == "NUMERACY_nb"){
          //Assume the second row is data!
          numeracyCol = j;
          dataSetType = 'Outcomes Level';
        }

        if ( set[0][j] == "READING_nb"){
          //Assume the second row is data!
          readingCol = j;
          dataSetType = 'Outcomes Level';
        }

        if ( set[0][j] == "SPELLING_nb"){
          //Assume the second row is data!
          spellingCol = j;
          dataSetType = 'Outcomes Level';
        }

        //GRAMMAR & PUNCTUATION_nb
        if ( set[0][j] == "GRAMMAR & PUNCTUATION_nb"){
          //Assume the second row is data!
          grammarCol = j;
          dataSetType = 'Outcomes Level';
        }

        if ( set[0][j] == "WRITING_nb"){
          //Assume the second row is data!
          writingCol = j;
          dataSetType = 'Outcomes Level';
        }

        if ( set[0][j] == "Student Score"){
          //Assume the second row is data!
          studentScoreCol = j;
          dataSetType = 'Question Level';
        }
      }

      console.log('grammarCol is '+grammarCol);

      if (( year !== false ) && ( level !== false )){
        //Get the index or create them
        var levelIndex = getLevelIndex(level);
        var yearIndex = getYearIndex(year,levelIndex);
        var numeracyIndex = getDomainIndex("Numeracy",yearIndex,levelIndex);
        var readingIndex = getDomainIndex("Reading",yearIndex,levelIndex);
        var spellingIndex = getDomainIndex("Spelling",yearIndex,levelIndex);
        var grammarIndex = getDomainIndex("Grammar & Punctuation",yearIndex,levelIndex);
        var writingIndex = getDomainIndex("Writing",yearIndex,levelIndex);

        for(var i=1;i<=10;i++){
          data.totals.levels[levelIndex].years[yearIndex].domains[numeracyIndex]['band'+i] = 0;
          data.totals.levels[levelIndex].years[yearIndex].domains[readingIndex]['band'+i] = 0;
          data.totals.levels[levelIndex].years[yearIndex].domains[spellingIndex]['band'+i] = 0;
          data.totals.levels[levelIndex].years[yearIndex].domains[grammarIndex]['band'+i] = 0;
          data.totals.levels[levelIndex].years[yearIndex].domains[writingIndex]['band'+i] = 0;
        }
      }



      for(var j=1; j<set.length;j++){
        //Is the first line a heading? Do we need to check?



        //Find the year and level, check against the domain column
        if ( parseInt(set[j][numeracyCol]) > 0){
          data.totals.levels[levelIndex].years[yearIndex].domains[numeracyIndex].students++;

          data.totals.levels[levelIndex].years[yearIndex].domains[numeracyIndex]['band'+naplanService.getBand(set[j][numeracyCol])]++;

        }

        if ( parseInt(set[j][readingCol]) > 0){
          data.totals.levels[levelIndex].years[yearIndex].domains[readingIndex].students++;

          data.totals.levels[levelIndex].years[yearIndex].domains[readingIndex]['band'+naplanService.getBand(set[j][readingCol])]++;
        }

        if ( parseInt(set[j][spellingCol]) > 0){
          data.totals.levels[levelIndex].years[yearIndex].domains[spellingIndex].students++;

          data.totals.levels[levelIndex].years[yearIndex].domains[spellingIndex]['band'+naplanService.getBand(set[j][spellingCol])]++;
        }

        if ( parseInt(set[j][grammarCol]) > 0){
          data.totals.levels[levelIndex].years[yearIndex].domains[grammarIndex].students++;

          data.totals.levels[levelIndex].years[yearIndex].domains[grammarIndex]['band'+naplanService.getBand(set[j][grammarCol])]++;
        }

        if ( parseInt(set[j][writingCol]) > 0){
          data.totals.levels[levelIndex].years[yearIndex].domains[writingIndex].students++;

          data.totals.levels[levelIndex].years[yearIndex].domains[writingIndex]['band'+naplanService.getBand(set[j][writingCol])]++;
        }
      }

    data.meta.push({name: fileName, type: dataSetType, year: year, level: level});

    return data;
  }



  //FIXME

  return {
    getData : function(){

      //console.log(data);
      if ( typeof data.totals.levels != 'undefined'){
        data.totals.levels.sort(function(a, b) {
            return parseFloat(a['level']) - parseFloat(b['level']);
        });
        for(var i=0;i<data.totals.levels.length;i++){
          data.totals.levels[i].years.sort(function(a, b) {
              return parseFloat(b['year']) - parseFloat(a['year']);
          });
        }

        return data;
      }

      return false;
    },

    getSchoolResponseToQuestion : function(domain,year,level,question){
//console.log('here. domain:'+domain+',year:'+year+',level:'+level+',question:'+question);
      var responses = [];
      var questionSet = false;
      var setIndex = false;

      var domainCol = false;
      var dimensionCol = false;
      var yearCol = false;
      var levelCol = false;

      var firstNameCol = false;
      var surnameCol = false;
      var classCol = false;
      var casesIdCol = false;

      var questionNumberCol = false;
      var scoreCol = false;
      var maxScoreCol = false;
      var correctAnswerCol = false;
      var responseCol = false;

      var theSet = false;

      for(var i=0; i<data.sets.length;i++){
        if (data.sets[i].length > 1 ){
          //Get column headings
          for(var j=0;j<data.sets[i][0].length;j++){
            if ( data.sets[i][0][j] == 'Student Score'){
              //Assume the second row is data!
              scoreCol = j;
              setIndex = i;
              questionSet = true;

              //This is a question set.
              for(var k=0;k<data.sets[i][0].length;k++){
                if ( data.sets[i][0][k] == 'Outcome Name'){
                    domainCol = k;

                }

                if ( data.sets[i][0][k] == 'APS Year'){
                  if ( parseInt(data.sets[i][1][k]) == parseInt(year) ){
                    yearCol = k;

                  } else {
                    questionSet = false;

                  }
                }

                if ( data.sets[i][0][k] == 'Reporting Test'){

                  if ( data.sets[i][1][k] == 'YR'+level+'P' ){

                    levelCol = k;
                  } else {
                    questionSet = false;

                  }
                }

                if ( data.sets[i][0][k] == 'Dimension Name'){
                    dimensionCol = k;
                }

                if ( data.sets[i][0][k] == 'First Name'){
                    firstNameCol = k;
                }

                if ( data.sets[i][0][k] == 'Surname'){
                    surnameCol = k;
                }

                if ( data.sets[i][0][k] == 'Class'){
                    classCol = k;
                }

                if ( data.sets[i][0][k] == 'Cases ID'){
                    casesIdCol = k;
                }

                if ( data.sets[i][0][k] == 'Question Number'){
                    questionNumberCol = k;
                }

                if ( data.sets[i][0][k] == 'Student Score'){
                    scoreCol = k;
                }

                if ( data.sets[i][0][k] == 'Max Score'){
                    maxScoreCol = k;
                }

                if ( data.sets[i][0][k] == 'Correct Answer'){
                    correctAnswerCol = k;
                }

                if ( data.sets[i][0][k] == 'Student Response'){
                    responseCol = k;
                }
              }

            }
          }

          if ( questionSet == false){

            setIndex = false;
            /*
            domainCol = false;
            dimensionCol = false;
            yearCol = false;
            levelCol = false;
            firstNameCol = false;
            surnameCol = false;
            classCol = false;
            casesIdCol = false;
            questionNumberCol = false;
            scoreCol = false;
            maxScoreCol = false;
            correctAnswerCol = false;
            */
          } else {
            theSet = data.sets[setIndex];
          }

        }
      }

      //console.log(theSet);

      if ( theSet != false){

        for( var i=1; i<theSet.length;i++){

          if (( compare(theSet[i][domainCol], domain,'string')) && (theSet[i][questionNumberCol] == question )){

            var response = {
              domain : theSet[i][domainCol],
              dimension : toTitleCase(theSet[i][dimensionCol]),
              year : theSet[i][yearCol],
              level : theSet[i][levelCol],
              firstName : theSet[i][firstNameCol],
              surname : theSet[i][surnameCol],
              class : theSet[i][classCol],
              casesId : theSet[i][casesIdCol],
              questionNumber : theSet[i][questionNumberCol],
              score : theSet[i][scoreCol],
              maxScore : theSet[i][maxScoreCol],
              correctAnswer :theSet[i][correctAnswerCol],
              response :theSet[i][responseCol]
            };

            var rawScore = 0;
            var totalQuestions = 0;
            for( var k=1; k<theSet.length;k++){
              if( (response.casesId == theSet[k][casesIdCol]) && (compare(response.domain,theSet[k][domainCol])) && (response.level == theSet[k][levelCol]) && (response.year == theSet[k][yearCol]) ){
                totalQuestions = totalQuestions + parseInt(theSet[k][maxScoreCol]);
                rawScore = rawScore + parseInt(theSet[k][scoreCol]);
              }
            }

            response.testRawScore = rawScore;
            response.testTotalQuestions = totalQuestions;

            response.scaledScore = naplanService.getScaledScore( domain, year, level, rawScore);
            response.scaledError = naplanService.getScaledError( domain, year, level, response.scaledScore);
            response.band = naplanService.getBand( response.scaledScore, domain, year, level);


            responses.push(response);
            //console.log(responses);
          }
        }
      }

      return responses;
    },

    getSchoolTotalResponseToQuestion : function(domain,year,level,question){

      var correctQuestions = 0;
      var responses = this.getSchoolResponseToQuestion(domain,year,level,question);

      for(var i=0; i<responses.length;i++){
        if ( parseInt(responses[i].score) == 1){
          correctQuestions++;
        }
      }

      //console.log(correctQuestions);

      return correctQuestions / responses.length * 100;
    },

    getStudentResponses : function(domain, year, level){

      var questions = tableService.getStudentResponses(domain,year,level);

      //TODO: Get school data.
      if (questions.length>0){
        for(var i=0; i<questions.length;i++){
          questions[i].school = this.getSchoolTotalResponseToQuestion(domain,year,level,questions[i].question);
          questions[i].difference = questions[i].school - questions[i].state;

          if ( typeof questions[i].dimension != 'undefined'){
            questions[i].dimension = toTitleCase(questions[i].dimension);
          }

          if ( typeof questions[i].word != 'undefined'){
            questions[i].word = toTitleCase(questions[i].word);
          }
        }
      }

      return questions;
    },


    getStudentResponsesWriting : function(year, level){

      var domain = 'Writing';

      var questions = tableService.getStudentResponses(domain, year,level);
      console.log(questions);

      //TODO: Get school data.
      if (questions.length>0){
        for(var i=0; i<questions.length;i++){
          var studentScores = this.getSchoolResponseToQuestion(domain,year,level,questions[i].question);
          for(var j=0; j<studentScores.length;j++){
            //studentScores[j].score
            if ( questions[i].scores.length>0){

              for(var k=0;k<questions[i].scores.length;k++){
                if( typeof questions[i].scores[k].school == 'undefined' ){
                  questions[i].scores[k].schoolTotal = 0;
                }

                if( studentScores[j].score == questions[i].scores[k].score ){
                  questions[i].scores[k].schoolTotal++;
                }
              }

              for(var k=0;k<questions[i].scores.length;k++){
                questions[i].scores[k].school = questions[i].scores[k].schoolTotal / studentScores.length * 100;
              }
            }
          }
        }
      }



      return questions;
    },

    getMatchedTest : function(domain,year,level,testError,studentError){


      //The cache seems to have trouble with the trusted html

      var cache = cacheService.get("getMatchedTest",[domain,year,level,testError,studentError]);
      if( cache  !== false){
        return cache;
      }


      var currentYear = parseInt(year);
      var currentLevel = parseInt(level);

      var previousYear = parseInt(year) - 2;
      var previousLevel = parseInt(level) - 2;

      var currentTest = tableService.getEquivalenceTable(domain,currentYear,currentLevel);
      var previousTest = tableService.getEquivalenceTable(domain,previousYear,previousLevel);

      //Get student results.

      var cohort = this.getMatchedCohort(domain, year, level, testError, studentError);


      //console.log(currentTest);
      //console.log(previousTest);
      var results = [];

      for(var i=0;i<previousTest.length;i++){
        results[i] = [];

        for(var j=0;j<currentTest.length;j++){
          var students = [];

          for(var k=0;k<cohort.students.length;k++){
            if ((parseInt(cohort.students[k].currentScore) == parseInt(currentTest[j].scaledScore)) && (parseInt(cohort.students[k].previousScore) == parseInt(previousTest[i].scaledScore))){
              var student = {
                casesId : cohort.students[k].casesId,
                firstName : cohort.students[k].firstName,
                surname : cohort.students[k].surname,
                class : cohort.students[k].class};

              students.push(student);
            }
          }

          var data = {
            currentRawScore: currentTest[j].rawScore,
            currentScaledScore: currentTest[j].scaledScore,
            currentError : currentTest[j].error,
            previousRawScore: previousTest[i].rawScore,
            previousScaledScore: previousTest[i].scaledScore,
            previousError : previousTest[i].error,
            low : currentTest[j].low,
            high : currentTest[j].high,
            students : students
          };

          var low = 0;
          var average = 0;
          var high = 0;

          var studentRg = this.getRelativeGrowthProbabilities(currentTest[j].scaledScore,previousTest[i].scaledScore,domain, year, level,testError,studentError);
          //console.log(studentRg.data.data);

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
          for(var m=0;m<students.length;m++){
            html = html + '<div>'+students[m].surname+', '+students[m].firstName+'</div>';
          }
          html = html + '<div><table class="table table-bordered"><thead><th>Low</th><th>Average</th><th>High</th></thead><tbody><tr><td>'+low.toString()+'%</td><td>'+average.toString()+'%</td><td>'+high.toString()+'%</td></tbody></table></div>';

          data.popover = $sce.trustAsHtml(html);
//console.log(data.popover);
          results[i][j] = data;
        }
      }

      cacheService.set("getMatchedTest",[domain,year,level,testError,studentError], results);

      return results;
    },


    parseData : function(set, fileName){
      var d = parseData(set, fileName);
      localStorageService.set('data',angular.toJson(d));
      return d;
    },

    hasData : function(){

      return hasData;
    },

    usingLocalStorage : function(){
      //TODO: Simple check to see if user is using localStorage
      return usingLocalStorage();

    },

    useLocalStorage : function(choice){
      //TODO: Sets whether localStorage is being used
      useLocalStorage();
    },

    deleteLocalStorage : function(){
      //TODO: Deletes all localStorage data
      deleteLocalStorage();
    },

    getStudentData : function(casesId, domain, level, testError, studentError){

      var numeracyCol = false;
      var readingCol = false;
      var spellingCol = false;
      var grammarCol = false;
      var writingCol = false;
      var firstNameCol = false;
      var surnameCol = false;
      var casesIdCol = false;
      var yearCol = false;
      var levelCol = false;

      var studentData = {
        casesId : casesId,
        results : {}
      };

      for(var i=0; i<data.sets.length;i++){
        if (data.sets[i].length > 1 ){
          //Get column headings

          casesIdCol = false;
          for(var j=0;j<data.sets[i][0].length;j++){
            if ( data.sets[i][0][j] == 'Cases ID'){
              //Assume the second row is data!
              casesIdCol = j;
            }

            if ( data.sets[i][0][j] == 'APS Year'){
              //Assume the second row is data!
              yearCol = j;
            }

            if ( data.sets[i][0][j] == 'Reporting Test'){
              //Assume the second row is data!
              levelCol = j;
            }


            if ( data.sets[i][0][j] == 'First Name'){
              //Assume the second row is data!
              firstNameCol = j;
            }

            if ( data.sets[i][0][j] == 'Surname'){
              //Assume the second row is data!
              surnameCol = j;
            }


            if ( data.sets[i][0][j] == "NUMERACY_nb"){
              //Assume the second row is data!
              numeracyCol = j;
            }

            if ( data.sets[i][0][j] == "READING_nb"){
              //Assume the second row is data!
              readingCol = j;
            }

            if ( data.sets[i][0][j] == "SPELLING_nb"){
              //Assume the second row is data!
              spellingCol = j;
            }

            //GRAMMAR & PUNCTUATION_nb
            if ( data.sets[i][0][j] == "GRAMMAR & PUNCTUATION_nb"){
              //Assume the second row is data!
              grammarCol = j;
            }

            if ( data.sets[i][0][j] == "WRITING_nb"){
              //Assume the second row is data!
              writingCol = j;
            }


          }

          if ( casesIdCol !== false){

            for(var j=0;j<data.sets[i].length;j++){
              if ( data.sets[i][j][casesIdCol] == casesId ){
                //Need to have the other column headings so that we can match the data
                studentData.firstName =  data.sets[i][j][firstNameCol];
                studentData.surname =  data.sets[i][j][surnameCol];

                var level = false;

                if ( typeof studentData.results.numeracy == 'undefined' ){
                  studentData.results.numeracy = {};

                }

                if ( data.sets[i][j][levelCol] == 'YR3P'){
                  level = 3;
                }

                if ( data.sets[i][j][levelCol] == 'YR5P'){
                  level = 5;
                }

                if ( data.sets[i][j][levelCol] == 'YR7P'){
                  level = 7;
                }

                if ( data.sets[i][j][levelCol] == 'YR9P'){
                  level = 9;
                }

                if ( data.sets[i][j][numeracyCol] != ''){
                  var scaledError = naplanService.getScaledError("Numeracy", data.sets[i][j][yearCol], level, data.sets[i][j][numeracyCol]);

                  studentData.results.numeracy[data.sets[i][j][yearCol]] =
                  {
                    score : data.sets[i][j][numeracyCol],
                    year : data.sets[i][j][yearCol],
                    level : level,
                    scaledError : scaledError,
                    band : naplanService.getBand(data.sets[i][j][numeracyCol]),
                    bands : naplanService.getBandProbabilities( "Numeracy", data.sets[i][j][yearCol], level, data.sets[i][j][numeracyCol], scaledError,testError, studentError )
                  };
                }

                if ( data.sets[i][j][readingCol] != ''){
                  if ( typeof studentData.results.reading == 'undefined' ){
                    studentData.results.reading = {};

                  }
                  studentData.results.reading[data.sets[i][j][yearCol]] =
                  {
                    score : data.sets[i][j][readingCol],
                    year : data.sets[i][j][yearCol],
                    level : level,
                    scaledError : scaledError,
                    band : naplanService.getBand(data.sets[i][j][readingCol]),
                    bands : naplanService.getBandProbabilities( "Reading", data.sets[i][j][yearCol], level, data.sets[i][j][readingCol], scaledError, testError, studentError )

                  };
                }

                if ( data.sets[i][j][writingCol] != ''){
                  if ( typeof studentData.results.writing == 'undefined' ){
                    studentData.results.writing = {};

                  }
                  studentData.results.writing[data.sets[i][j][yearCol]] =
                  {
                    score : data.sets[i][j][writingCol],
                    year : data.sets[i][j][yearCol],
                    level : level,
                    scaledError : scaledError,
                    band : naplanService.getBand(data.sets[i][j][writingCol]),
                    bands : naplanService.getBandProbabilities( "Writing", data.sets[i][j][yearCol], level, data.sets[i][j][writingCol], scaledError, testError, studentError )

                  };
                }

                if ( data.sets[i][j][spellingCol] != ''){
                  if ( typeof studentData.results.spelling == 'undefined' ){
                    studentData.results.spelling = {};

                  }
                  studentData.results.spelling[data.sets[i][j][yearCol]] =
                  {
                    score : data.sets[i][j][spellingCol],
                    year : data.sets[i][j][yearCol],
                    level : level,
                    scaledError : scaledError,
                    band : naplanService.getBand(data.sets[i][j][spellingCol]),
                    bands : naplanService.getBandProbabilities( "Spelling", data.sets[i][j][yearCol], level, data.sets[i][j][spellingCol], scaledError, testError, studentError )

                  };
                }

                if ( data.sets[i][j][grammarCol] != ''){
                  if ( typeof studentData.results.grammar == 'undefined' ){
                    studentData.results.grammar = {};

                  }
                  studentData.results.grammar[data.sets[i][j][yearCol]] =
                  {
                    score : data.sets[i][j][grammarCol],
                    year : data.sets[i][j][yearCol],
                    level : level,
                    scaledError : scaledError,
                    band : naplanService.getBand(data.sets[i][j][grammarCol]),
                    bands : naplanService.getBandProbabilities( "Grammar & Punctuation", data.sets[i][j][yearCol], level, data.sets[i][j][grammarCol], scaledError, testError, studentError )

                  };
                }

              }
            }
          }
        }
      }

      return studentData;
    },

    getRelativeGrowthProbabilities : function (current, previous, domain, year, level, testError, studentError){

      var cache = cacheService.get("getRelativeGrowthProbabilities",[current, previous, domain, year, level, testError, studentError]);
      if( cache  !== false){
        return cache;
      }

      /*
      var scores = tableService.getEquivalenceTable(domain,year,level);
      var highLimit = false;
      var LowLimit = false;
      var high = 0;
      var average = 0;
      var low = 0;
      var error = false;

      for(var i=0;i<scores.length;i++){
        if (parseInt(scores[i].scaledScore) == current){
          highLimit = scores[i].high;
          LowLimit = scores[i].low;
          error = scores[i].error;
        }
      }

      if ( highLimit !== false){
        var
      }
      */

      var data = naplanService.getGrowthConfidences([{currentScore: current ,previousScore: previous}], domain, year, level, testError, studentError);

      cacheService.set("getRelativeGrowthProbabilities",[domain, year, level, testError, studentError],data);

      return data;
    },

    getMatchedCohort : function (domain, year, level, testError, studentError){
      /*
        1. Gets the scaled score and band for year, level and compares it with the casesId matches for year-2, level-2
        2. Calculates the relative growth for each student.
      */

      //FIXME: Get data from tableSerVice!!

      //Check cache
      var cache = cacheService.get("getMatchedCohort",[domain, year, level, testError, studentError]);
      if( cache  !== false){
        return cache;
      }


      var numeracyCol = false;
      var readingCol = false;
      var spellingCol = false;
      var grammarCol = false;
      var writingCol = false;
      var firstNameCol = false;
      var surnameCol = false;
      var casesIdCol = false;
      var yearCol = false;
      var levelCol = false;

      var twoAgo = parseInt(level) - 2;

      var cohortData = {
        year : year,
        level : level,
        totals : {lowGain: 0, averageGain: 0, highGain: 0, students: 0},
        students : [],
        tests : []
      };

      var year3data = false; //Though this could be foundYear7
      var year5data = false; //And this could be foundYear9 - they are just names

      for(var i=0; i<data.sets.length;i++){
        //Check the year
        var theCol = getColumn("APS Year", data.sets[i][0] );
        //console.log('theCol is '+theCol);

        if (theCol !== false){
          var theVal = data.sets[i][1][theCol];
          //console.log('theVal is '+theVal);

          if ( theVal == year){
            //console.log("Match!");

            yearCol = theCol;
            var theCol = getColumn('Reporting Test', data.sets[i][0] );
            //console.log('theCol is '+theCol);
            if (theCol !== false){
              var theVal = data.sets[i][1][theCol];
              //console.log('theVal is '+theVal);
              if ( theVal == 'YR'+level+'P'){
                //console.log("Match!");
                levelCol = theCol;
                //Get the domain
                var colHeading = getDomainHeading(domain);
                //console.log('The colHeading is '+colHeading);
                var theCol = getColumn(colHeading, data.sets[i][0] );
                //console.log('theCol is '+theCol);
                if (theCol !== false){
                    //console.log("Match!");
                    //domainCol = theCol;
                    year5data = {domainCol: theCol, yearCol: yearCol, levelCol: levelCol, data: data.sets[i]};

                    //console.log(angular.fromJson(angular.toJson(year5data)));
                }
              }
            }

          }
        }
      }
      //End of year3data section

      if ( year5data !== false){
        //console.log("Trying to find year5data");

        for(var i=0; i<data.sets.length;i++){
          //Check the year
          var theCol = getColumn("APS Year", data.sets[i][0] );
          if (theCol !== false){
            var theVal = data.sets[i][1][theCol];
            if ( parseInt(theVal) == (parseInt(year)-2)){
              //console.log("Match year -2");
              yearCol = theCol;
              var theCol = getColumn('Reporting Test', data.sets[i][0] );
              if (theCol !== false){
                var theVal = data.sets[i][1][theCol];

                //console.log("Trying to match theVal:"+theVal+" with YR"+twoAgo+"P");
                if ( theVal == 'YR'+twoAgo+'P'){
                  levelCol = theCol;
                  //Get the domain
                  var colHeading = getDomainHeading(domain);
                  var theCol = getColumn(colHeading, data.sets[i][0] );
                  if (theCol !== false){
                      year3data = {domainCol: theCol, yearCol: yearCol, levelCol: levelCol, data: data.sets[i]};
                      //console.log(angular.fromJson(angular.toJson(year3data)));

                  }
                }
              }

            }
          }
        }
      }
      //End of year3data section

      //Match the cohorts on casesId, add to cohortData
      var CasesIdCol5 = getColumn("Cases ID", year5data.data[0] );
      var CasesIdCol3 = getColumn("Cases ID", year3data.data[0] );

      for(var i=1;i<year5data.data.length;i++){
        for(var j=1;j<year3data.data.length;j++){
          if( year5data.data[i][CasesIdCol5] ==  year3data.data[j][CasesIdCol3]){
            //Need to get the name of the student.
            if ( ( parseInt(year5data.data[i][year5data.domainCol]) > 0) && (parseInt(year3data.data[j][year3data.domainCol]) > 0)){

              var firstNameCol = getColumn("First Name", year5data.data[0] );
              var surnameCol = getColumn("Surname", year5data.data[0] );
              var classCol = getColumn("Class", year5data.data[0] );
              var dobCol = getColumn("Date of Birth", year5data.data[0] );
              var genderCol = getColumn("Gender", year5data.data[0] );
              var LBOTECol = getColumn("LBOTE", year5data.data[0] );
              var ATSICol = getColumn("ATSI", year5data.data[0] );

              var currentScaledError = naplanService.getScaledError(domain, year, level, parseInt(year5data.data[i][year5data.domainCol]));
              var previousScaledError = naplanService.getScaledError(domain, parseInt(year) -2, parseInt(level) -2, parseInt(year3data.data[j][year3data.domainCol]));

              var gains = naplanService.getGainProbabilities(parseInt(year5data.data[i][year5data.domainCol]), currentScaledError, parseInt(year3data.data[j][year3data.domainCol]), previousScaledError, testError, studentError);
              var difference = Math.round(parseFloat(year5data.data[i][year5data.domainCol], 2) - parseFloat(year3data.data[j][year3data.domainCol]),2);
              var gain = naplanService.getGain(year5data.data[i][year5data.domainCol],year3data.data[j][year3data.domainCol]);

              var student = {
                casesId : year5data.data[i][CasesIdCol5],
                firstName : year5data.data[i][firstNameCol],
                surname : year5data.data[i][surnameCol],
                class : year5data.data[i][classCol],
                domain : domain,
                currentScore : year5data.data[i][year5data.domainCol],
                previousScore : year3data.data[j][year3data.domainCol],
                currentBand : naplanService.getBand(year5data.data[i][year5data.domainCol]),
                previousBand : naplanService.getBand(year3data.data[j][year3data.domainCol]),
                gain : gain,
                lowGain : gains.lowGain,
                averageGain : gains.averageGain,
                highGain : gains.highGain,
                difference : difference
              };
              cohortData.students.push(student);
              cohortData.totals.students++;
              cohortData.totals[gain+'Gain']++;

            }
          }
        }
      }

      //Sample the data
      var testData = naplanService.getGrowthConfidences(cohortData.students, domain, year, level, testError, studentError);
      cohortData.tests.push(testData);
      //console.log(cohortData);

      cacheService.set("getMatchedCohort",[domain, year, level, testError, studentError],cohortData);
      return cohortData;
    },

    getDomainData : function(domain, year, level, testError, studentError){
      var yearFound = false;
      var levelFound = false;
      var rawData = false;
      var domainData = [];
      var setType = false;


      for(var i=0;i<data.sets.length;i++){
        if (data.sets[i].length > 1 ){
          //Get column headings
          for(var j=0;j<data.sets[i][0].length;j++){

            if ( data.sets[i][0][j] == 'NUMERACY_nb'){
              //Assume the second row is data!
              setType = 'outcomes';
              //console.log('Found outcomes set: '+angular.toJson(data.sets[i][1]));
              for(var l=0;l<data.sets[i][0].length;l++){
                  if ( data.sets[i][0][l] == "APS Year") {
                    if (parseInt(data.sets[i][1][l]) == parseInt(year)){
                      //Assume the second row is data!
                      yearFound = true;
                      for(var k=0;k<data.sets[i][0].length;k++){
                        if ( data.sets[i][0][k] == "Reporting Test") {
                          if (data.sets[i][1][k] == 'YR'+level+'P'){
                            levelFound = true;
                            rawData = data.sets[i];
                          }
                        }
                      }
                    }
                }
              }

              if ( data.sets[i][0][j] == 'Question Number'){
                //Assume the second row is data!
                setType = 'questions';
              }
            }
          }
        }
      }

      for(var j=0;j<rawData[0].length;j++){
        if ( rawData[0][j] == 'NUMERACY_nb'){
          //Assume the second row is data!
          setType = 'outcomes';

        }

        if ( rawData[0][j] == 'Question Number'){
          //Assume the second row is data!
          setType = 'questions';
        }
      }

      //console.log('setType: '+setType);

      if (( levelFound == true) && ( yearFound == true) && (setType == 'outcomes')){
        //console.log('Found - '+setType);
        //console.log(rawData);
        //Get column headings
        //'First Name', 'Surname', 'Cases ID', 'NUMERACY_nb', 'SPELLING_nb', 'GRAMMAR & PUNCTUATION_nb', 'WRITING_nb', 'READING_nb'

        var readingCol = false;
        var spellingCol = false;
        var grammarCol = false;
        var writingCol = false;
        var firstNameCol = false;
        var surnameCol = false;
        var casesIdCol = false;
        var numeracyCol = false;

        for(var j=0;j<rawData[0].length;j++){

          if ( rawData[0][j] == 'First Name'){
            //Assume the second row is data!
            firstNameCol = j;
          }

          if ( rawData[0][j] == 'Surname'){
            //Assume the second row is data!
            surnameCol = j;
          }

          if ( rawData[0][j] == 'Cases ID'){
            //Assume the second row is data!
            casesIdCol = j;
          }

          if ( rawData[0][j] == "NUMERACY_nb"){
            //Assume the second row is data!
            numeracyCol = j;
          }

          if ( rawData[0][j] == "READING_nb"){
            //Assume the second row is data!
            readingCol = j;
          }

          if ( rawData[0][j] == "SPELLING_nb"){
            //Assume the second row is data!
            spellingCol = j;
          }

          //GRAMMAR & PUNCTUATION_nb
          if ( rawData[0][j] == "GRAMMAR & PUNCTUATION_nb"){
            //Assume the second row is data!
            grammarCol = j;
          }

          if ( rawData[0][j] == "WRITING_nb"){
            //Assume the second row is data!
            writingCol = j;
          }
        }

        for(var i=1;i<rawData.length;i++){
          var resultObj = {
            casesId: rawData[i][casesIdCol],
            firstName: rawData[i][firstNameCol],
            surname: rawData[i][surnameCol],
            numeracy: rawData[i][numeracyCol],
            reading: rawData[i][readingCol],
            writing: rawData[i][writingCol],
            spelling: rawData[i][spellingCol],
            grammar: rawData[i][grammarCol]};

            switch( domain ){
              case "Numeracy":
                resultObj.score = resultObj.numeracy;
                resultObj.band = naplanService.getBand(resultObj.numeracy);
                resultObj.error = naplanService.getScaledError("Numeracy", year, level, resultObj.numeracy);
                resultObj.bands = naplanService.getBandProbabilities(domain, year, level, resultObj.numeracy,resultObj.error, testError, studentError);
                break;

              case "Spelling":
                resultObj.score = resultObj.spelling;
                resultObj.band = naplanService.getBand(resultObj.spelling);
                resultObj.error = naplanService.getScaledError("Spelling", year, level, resultObj.spelling);
                resultObj.bands = naplanService.getBandProbabilities(domain, year, level, resultObj.spelling,resultObj.error, testError, studentError);
                break;

              case "Writing":
                resultObj.score = resultObj.writing;
                resultObj.band = naplanService.getBand(resultObj.writing);
                resultObj.error = naplanService.getScaledError("Writing", year, level, resultObj.writing);
                resultObj.bands = naplanService.getBandProbabilities(domain, year, level, resultObj.writing,resultObj.error, testError, studentError);
                break;

                case "Reading":
                  resultObj.score = resultObj.reading;
                  resultObj.band = naplanService.getBand(resultObj.reading);
                  resultObj.error = naplanService.getScaledError("Reading", year, level, resultObj.reading);
                  resultObj.bands = naplanService.getBandProbabilities(domain, year, level, resultObj.reading,resultObj.error, testError, studentError);
                  break;

              case "Grammar & Punctuation":
                resultObj.score = resultObj.grammar;
                resultObj.band = naplanService.getBand(resultObj.grammar);
                resultObj.error = naplanService.getScaledError("Grammar", year, level, resultObj.grammar);
                resultObj.bands = naplanService.getBandProbabilities(domain, year, level, resultObj.grammar,resultObj.error, testError, studentError);
                break;
            }


          domainData.push(angular.fromJson(angular.toJson(resultObj)));
        }
      } else {
        //console.log('Not found');
      }

      return domainData;
    },

    getWritingDomainData : function(year, level, testError, studentError){
      var yearFound = false;
      var levelFound = false;
      var rawData = false;
      var domainData = [];
      var setType = false;
      var domain = 'Writing';
      var questionNumberCol = false;


      for(var i=0;i<data.sets.length;i++){
        if (data.sets[i].length > 1 ){
          //Get column headings
          for(var j=0;j<data.sets[i][0].length;j++){

            if ( data.sets[i][0][j] == 'WRITING_nb'){
              //Assume the second row is data!
              setType = 'outcomes';
              //console.log('Found outcomes set: '+angular.toJson(data.sets[i][1]));
              for(var l=0;l<data.sets[i][0].length;l++){
                  if ( data.sets[i][0][l] == "APS Year") {
                    if (parseInt(data.sets[i][1][l]) == parseInt(year)){
                      //Assume the second row is data!
                      yearFound = true;
                      for(var k=0;k<data.sets[i][0].length;k++){
                        if ( data.sets[i][0][k] == "Reporting Test") {
                          if (data.sets[i][1][k] == 'YR'+level+'P'){
                            levelFound = true;
                            rawData = data.sets[i];
                          }
                        }
                      }
                    }
                }
              }

              if ( data.sets[i][0][j] == 'Question Number'){
                //Assume the second row is data!
                setType = 'questions';
                questionNumberCol = j;
              }
            }
          }
        }
      }

      for(var j=0;j<rawData[0].length;j++){
        if ( rawData[0][j] == 'NUMERACY_nb'){
          //Assume the second row is data!
          setType = 'outcomes';

        }

        if ( rawData[0][j] == 'Question Number'){
          //Assume the second row is data!
          setType = 'questions';
        }
      }

      //console.log('setType: '+setType);

      if (( levelFound == true) && ( yearFound == true) && (setType == 'outcomes')){
        //console.log('Found - '+setType);
        //console.log(rawData);
        //Get column headings
        //'First Name', 'Surname', 'Cases ID', 'NUMERACY_nb', 'SPELLING_nb', 'GRAMMAR & PUNCTUATION_nb', 'WRITING_nb', 'READING_nb'

        var readingCol = false;
        var spellingCol = false;
        var grammarCol = false;
        var writingCol = false;
        var firstNameCol = false;
        var surnameCol = false;
        var casesIdCol = false;
        var numeracyCol = false;

        for(var j=0;j<rawData[0].length;j++){

          if ( rawData[0][j] == 'First Name'){
            //Assume the second row is data!
            firstNameCol = j;
          }

          if ( rawData[0][j] == 'Surname'){
            //Assume the second row is data!
            surnameCol = j;
          }

          if ( rawData[0][j] == 'Cases ID'){
            //Assume the second row is data!
            casesIdCol = j;
          }



          if ( rawData[0][j] == "WRITING_nb"){
            //Assume the second row is data!
            writingCol = j;
          }
        }

        for(var i=1;i<rawData.length;i++){
          var resultObj = {
            casesId: rawData[i][casesIdCol],
            firstName: rawData[i][firstNameCol],
            surname: rawData[i][surnameCol],
            writing: rawData[i][writingCol]};

          resultObj.score = resultObj.writing;
          resultObj.band = naplanService.getBand(resultObj.writing);
          resultObj.error = naplanService.getScaledError("Writing", year, level, resultObj.writing);
          resultObj.bands = naplanService.getBandProbabilities(domain, year, level, resultObj.writing,resultObj.error, testError, studentError);

          //TODO: Get the score for each of the writing questions.


          domainData.push(angular.fromJson(angular.toJson(resultObj)));
        }
      } else {
        //console.log('Not found');
      }

      return domainData;
    }
  }
});
