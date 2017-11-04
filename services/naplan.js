"use strict";

naplanApp.service('naplanService', function (tableService) {
  /*
    This service includes all the NAPLAN specific tables used to identify bands, scores and errors.
  */

  function getTotalQuestions(domain,year,level){

    var test = [
      {year:2017, domain:'spelling',level:3,items:25},
      {year:2017, domain:'reading',level:3,items:37},
      {year:2017, domain:'numeracy',level:3,items:36},
      {year:2017, domain:'writing',level:3,items:48},
      {year:2017, domain:'grammar',level:3,items:25},
      {year:2017, domain:'spelling',level:5,items:25},
      {year:2017, domain:'reading',level:5,items:37},
      {year:2017, domain:'numeracy',level:5,items:42},
      {year:2017, domain:'writing',level:5,items:48},
      {year:2017, domain:'grammar',level:5,items:25}
      ];

    //placeholder
    return 25;
  }



  function getRandomMean(domain,year,level,scaledScore,errorRate){

    /*
    Order the scores pick a random score using guassain distribution based on the errorRate

    eg errorRate +/-12.5%  42 scores is 5.25, halve to get the standard deviation, 2.65,
    Find the position in the array (number of questions correct) select a random using that mean
    and the calculated standard deviation
    */

    var theSet = false;
    /*
    scores = [{domain:'Numeracy',year:2017,level:5,
      scores:[0,0,0,0,0,0,0,320,350,370.8,388.9,405.5,413.3,420.9,428.3,435.6,442.7,449.8,456.9,463.9,470.9,478,485.2,492.5,499.9,507.6,515.5,523.7,532.2,541.3,550.9,561,572.4,584.9,598.9,615.2,636,659.8,687,727,790,880]}];

      for(var i=0;i<scores.length;i++){
        //console.log('domain: '+domain+', scores[i].domain:'+scores[i].domain+' year: '+year+', scores[i].year: '+scores[i].year+', level:'+level+'  scores[i].level:'+ scores[i].level);
        if (( scores[i].domain == domain) && ( scores[i].year == year) && ( scores[i].level == level)){
          theSet = scores[i].scores;
          //console.log('match');
        }
      }

      */

    theSet = tableService.getEquivalenceTable(domain,year,level);



      if (theSet === false){
        //Couldn't find the set of questions so just return the scaledScore.
        //console.log('Warning: could not locate scores to create a random mean.');
        //console.log('scaledScore: '+scaledScore);
        return scaledScore;
      } else {
        var pos = false;

        for(var i=0;i<theSet.length;i++){
          if (scaledScore == theSet[i].scaledScore){
            pos = i;
          }
        }

        if (pos === false){
          console.log('Warning: could not locate scaled score in the set. Could not calculate a random mean.');
          return scaledScore;
        } else {
          var sd = theSet.length/100*errorRate/2;
          var random = gaussian(pos,sd);

          //TODO: CHeck for errors
          var guess = random();

          if (Math.round(guess) < 0){
            guess = 0;
          }

          if (guess>theSet.length){
            guess = theSet[theSet.length -1].scaledScore;
          }
          //console.log('The pos is '+pos+'. The sd is '+sd+' the guess is '+guess);
          //console.log('The scaledScore is '+scaledScore+'. The random mean is '+theSet[guess]);
          return theSet[guess].scaledScore;
        }
      }
  }

  function getSurroundingMeans(domain, year, level, scaledScore, number){


    //FIXME: Use data from tableService Instead

    var theSet = false;

    /*
    //FIXME: Had to add numbers at the start and the end to ensure we don't go off the scale.
    var scores = [{domain:'Numeracy',year:2017,level:5,
      scores:[0,0,100,100,100,370.8,370.8,370.8,370.8,370.8,388.9,405.5,413.3,420.9,428.3,435.6,442.7,449.8,456.9,463.9,470.9,478,485.2,492.5,499.9,507.6,515.5,523.7,532.2,541.3,550.9,561,572.4,584.9,598.9,615.2,636,659.8,687,727,790,880]}];

      for(var i=0;i<scores.length;i++){
        if (( scores[i].domain == domain) && ( scores[i].year == year) && ( scores[i].level == level)){
          theSet = scores[i].scores;
        }
      }
      */

      theSet = tableService.getEquivalenceTable(domain,year,level);

      if (theSet === false){
        //Couldn't find the set of questions so just return the scaledScore.
        switch (number){
          case 1:
            return [scaledScore,scaledScore,scaledScore];
            break;

          case 2:
            return [scaledScore,scaledScore,scaledScore,scaledScore,scaledScore];
            break;

          case 3:
            return [scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore];
            break;

          case 4:
            return [scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore];
            break;

          case 5:
            return [scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore];
            break;

          case 6:
            return [scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore];
            break;
        }
      } else {
        var pos = false;

        for(var i=0;i<theSet.length;i++){
          if (scaledScore == theSet[i].scaledScore){
            pos = i;
          }
        }

        if (pos === false){
          console.log('Warning: could not locate scaled score in the set. Could not calculate a random mean.');
          switch ( number){
            case 1:
              return [scaledScore,scaledScore,scaledScore];
              break;

            case 2:
              return [scaledScore,scaledScore,scaledScore,scaledScore,scaledScore];
              break;

            case 3:
              return [scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore];
              break;

            case 4:
              return [scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore];
              break;

            case 5:
              return [scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore];
              break;

            case 6:
              return [scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore,scaledScore];
              break;
          }
        } else {
          //FIXME: Check to see values exists. Can't return NaN values.
          switch ( number){
            case 1:
              return [theSet[pos-1].scaledScore,theSet[pos].scaledScore,theSet[pos+1].scaledScore];
              break;

            case 2:
              return [theSet[pos-2].scaledScore,theSet[pos-1].scaledScore,theSet[pos].scaledScore,theSet[pos+1].scaledScore,theSet[pos+2].scaledScore];
              break;

            case 3:
              return [theSet[pos-3].scaledScore,theSet[pos-2].scaledScore,theSet[pos-1].scaledScore,theSet[pos].scaledScore,theSet[pos+1].scaledScore,theSet[pos+2].scaledScore,theSet[pos+3].scaledScore];
              break;

            case 4:
              return [theSet[pos-4].scaledScore,theSet[pos-3].scaledScore,theSet[pos-2].scaledScore,theSet[pos-1].scaledScore,theSet[pos].scaledScore,theSet[pos+1].scaledScore,theSet[pos+2].scaledScore,theSet[pos+3].scaledScore,theSet[pos+4].scaledScore];
              break;

            case 5:
              return [theSet[pos-5].scaledScore,theSet[pos-4].scaledScore,theSet[pos-3].scaledScore,theSet[pos-2].scaledScore,theSet[pos-1].scaledScore,theSet[pos].scaledScore,theSet[pos+1].scaledScore,theSet[pos+2].scaledScore,theSet[pos+3].scaledScore,theSet[pos+4].scaledScore,theSet[pos+5].scaledScore];
              break;

            case 5:
              return [theSet[pos-6].scaledScore,theSet[pos-5].scaledScore,theSet[pos-4].scaledScore,theSet[pos-3].scaledScore,theSet[pos-2].scaledScore,theSet[pos-1].scaledScore,theSet[pos].scaledScore,theSet[pos+1].scaledScore,theSet[pos+2].scaledScore,theSet[pos+3].scaledScore,theSet[pos+4].scaledScore,theSet[pos+5].scaledScore,theSet[pos+6].scaledScore];
              break;
          }
        }

      }
  }

  function gaussian(mean, stdev) {

    //console.log('mean:'+mean+' stdev:'+stdev);

    //Taken from https://stackoverflow.com/a/36481059
    var y2;
    var use_last = false;
    return function() {
        var y1;
        if(use_last) {
           y1 = y2;
           use_last = false;
        }
        else {
            var x1, x2, w;
            do {
                 x1 = 2.0 * Math.random() - 1.0;
                 x2 = 2.0 * Math.random() - 1.0;
                 w  = x1 * x1 + x2 * x2;
            } while( w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w))/w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
       }

       var retval = mean + stdev * y1;
       if(retval > 0)
           return retval;
       return -retval;
   }
}

  return {

    getSamplingSize : function(sample){

      switch(sample){
        case 'relative_growth':
          return 10;
          break;

        default:
          return 1000;
          break;
      }
    },

    sample : function(domain, year, level, scaledScore, testError, studentError){


    },

    getRgGainLimits : function(scaledScore,domain,year,level){

      var scores = tableService.getEquivalenceTable(domain,parseInt(year),parseInt(level));
      //console.log(scores);
      var highLimit = false;
      var LowLimit = false;
      var high = 0;
      var average = 0;
      var low = 0;
      var error = false;

      for(var i=0;i<scores.length;i++){
        //console.log("parseInt(scores[i].scaledScore):"+parseInt(scores[i].scaledScore)+", parseInt(scaledScore):"+ parseInt(scaledScore));
        if (parseInt(scores[i].scaledScore) == parseInt(scaledScore)){

          highLimit = scores[i].high;
          LowLimit = scores[i].low;
          error = scores[i].error;
        }
      }


      //FIXME: Instead return the type. low, medium, high.
      return {high : highLimit, low : LowLimit};
    },

    getGain : function( five, three){
      /*
        Low
        Year 3 Score (110 - 350) Year 3 Difference (-120 - 120)
        Year 3 Score (270 - 460) Year 3 Difference (-140 - 50)
        Year 3 Score (460 - 590) Year 3 Difference (-130 - 0)

        Average
        Year 5 Score (351 - 410) Year 3 Difference (121-180)
        Year 5 Score (461 - 520) Year 3 Difference (51-110)
        Year 5 Score (591- 660) Year 3 Difference (1- 70)

        High
        Year 5 Score (411-550) Year 3 Difference (181-320)
        Year 5 Score (521-730) Year 3 Difference (111-320)
        Year 5 Score (661 - 800) Year 3 Difference (71-210)
      */

      var theGain = 'low';
      var difference = parseInt(five) - parseInt(three);
      var current = parseInt(five);

      //Low: Year 5 Score (110 - 350) Year 3 Difference (-120 - 120)
      if (( current <= 350 ) && ( difference <= 120 )){
        theGain = 'low';
      }

      //Low: Year 5 Score (270 - 460) Year 3 Difference (-140 - 50)
      if (( current >= 270 ) && ( current <= 460 ) && ( difference <= 50 )){
        theGain = 'low';
      }

      //Low: Year 5 Score (460 - 590) Year 3 Difference (-130 - 0)
      if (( current >= 460 ) && ( current <= 590 ) && ( difference <= 25 )){
        theGain = 'low';
      }

      //Average: Year 5 Score (351 - 410) Year 3 Difference (121-180) //Michael Xu
      if (( current >= 351 ) &&  ( difference >= 121)   ){
        theGain = 'average';
      }

      //Average: Year 5 Score (461 - 520) Year 3 Difference (51-110)
      if (( current >= 441 ) &&  ( difference >= 41 )  ){
        theGain = 'average';
      }

      if (( current >= 461 ) && ( difference >= 25 )  ){
        theGain = 'average';
      }

      //Average: Year 5 Score (591- 660) Year 3 Difference (1- 70)
      if (( current >= 591 ) && ( difference >= -25 )  ){
        theGain = 'average';
      }

      //High: Year 5 Score (411-550) Year 3 Difference (181-320)
      if (( current >= 380 ) && ( difference >= 120 )  ){
        theGain = 'high';
      }

      if (( current >= 470 ) && ( difference >= 106 )  ){
        theGain = 'high';
      }

      //High: Year 5 Score (521-730) Year 3 Difference (111-320)
      if (( current >= 590)  && ( difference >= 90 )  ){
        theGain = 'high';
      }

      //High: Year 5 Score (661 - 800) Year 3 Difference (71-210)
      if (( current >= 661 ) && ( difference >= 71 )){
        theGain = 'high';
      }


      //FIXME: Instead return the type. low, medium, high.
      return theGain;
    },

    getClosestScaledScore : function(guessCurrent, domain, year, level){

      var scaledScore = 0;

      var scores = tableService.getEquivalenceTable(domain,parseInt(year),parseInt(level));
      var difference = 10000;

      for(var i=0;i<scores.length;i++){
        if (Math.abs((scores[i].scaledScore - parseFloat(guessCurrent))) < difference) {
          scaledScore = scores[i].scaledScore;
          difference = Math.abs((scores[i].scaledScore - parseInt(guessCurrent)));
        }
      }

      return scaledScore;

    },

    getGrowthConfidences : function(students, domain, year, level, testError, studentError){

      if ( typeof studentError == 'undefined'){
        studentError = 0;

      }


      if ( typeof testError == 'undefined'){
        testError = 0;

      }
      //console.log('the studentError is '+studentError);
      //console.log('the testError is '+testError);

      var samplingSize = 1000;

      var outcomes = [];

      var lowGain = 0;
      var averageGain = 0;
      var highGain = 0;
      var occurences = {lowGains:[],averageGains:[],highGains:[]};


      for(var i=0;i<samplingSize;i++){


        for( var s=0;s<students.length;s++){

          if ( typeof studentError == 'undefined'){
            studentError = 0;
          }
        //  console.log(students[s]);
          if ( studentError == 0){
            //console.log('here');
            var currentScaledError = this.getScaledError(domain,year, level, students[s].currentScore);
            //console.log('currentScaledError: '+currentScaledError);
            var previousScaledError = this.getScaledError(domain,year, level, students[s].previousScore);
            //console.log('previousScaledError: '+previousScaledError);

          } else {

            //FIXME: Not sure this works yet!
            var scaledScoreRange = getSurroundingMeans(domain, year, level, scaledScore, studentError);
            var guess = guassain(studentError+1,studentError/2);

            var currentScaledError = this.getScaledError(domain,year, level, students[s].currentScore);
            //console.log('currentScaledError: '+currentScaledError);
            var previousScaledError = this.getScaledError(domain,year, level, students[s].previousScore);
          }

          var randomCurrent = gaussian(parseFloat(students[s].currentScore),parseFloat(testError)+parseFloat(currentScaledError));
          var randomPrevious = gaussian(parseFloat(students[s].previousScore),parseFloat(testError)+parseFloat(previousScaledError));


          if ( studentError == 0){
            var guessCurrent = parseFloat(randomCurrent());
            var guessPrevious = parseFloat(randomPrevious());

          } else {
            //FIXME: Copy from below
          }

          var closestScaledScore = this.getClosestScaledScore(guessCurrent, domain, year, level);
//console.log('closestScaledScore is '+closestScaledScore);
          var gainLimits = this.getRgGainLimits(closestScaledScore, domain, year, level);

          //console.log("guessCurrent:"+closestScaledScore+",  guessPrevious"+guessPrevious+" highLimit: "+gainLimits.high+", lowLimit:"+gainLimits.low);
          if ( guessPrevious <= gainLimits.high ){
            highGain++;
          } else {
            if ( guessPrevious >= gainLimits.low ){
              lowGain++;
            } else {
              averageGain++;
            }
          }


        //  console.log('currentScaledScore: '+currentScaledScore+', currentScaledError:'+currentScaledError+', guessCurrent: '+guessCurrent+', previousScaledScore:'+previousScaledScore+', previousScaledError:'+previousScaledError+'  guessPrevious: '+guessPrevious);
        /*
          var theGain = this.getGain(guessCurrent,guessPrevious);

          switch( theGain){
            case 'low':
              lowGain++;
              break;

            case 'average':
              averageGain++;
              break;

            case 'high':
              highGain++;
              break;
        }
        */
      }
        var found = false;
        for(var l=0;l<outcomes.length;l++ ){
          if ((outcomes[l].highGain == highGain) && (outcomes[l].averageGain == averageGain) && (outcomes[l].lowGain == lowGain) ){
            found = true;
            outcomes[l].occurence++;
            outcomes[l].confidence = Math.round(outcomes[l].occurence / samplingSize * 100,2);
          }
        }

        if ( found == false){
          var outcome = {highGain: highGain, averageGain: averageGain, lowGain: lowGain, occurence: 1, confidence: (1/samplingSize*100)};
          outcomes.push(outcome);
        }

        if ( typeof occurences.highGains[highGain] == 'undefined'){
          occurences.highGains[highGain] = 1;
        } else {
          occurences.highGains[highGain]++;
        }

        if ( typeof occurences.averageGains[averageGain] == 'undefined'){
          occurences.averageGains[averageGain] = 1;
        } else {
          occurences.averageGains[averageGain]++;
        }

        if ( typeof occurences.lowGains[lowGain] == 'undefined'){
          occurences.lowGains[lowGain] = 1;
        } else {
          occurences.lowGains[lowGain]++;
        }


        //console.log(angular.toJson(outcomes));

        lowGain = 0;
        averageGain = 0;
        highGain = 0;
      }
      var testData = {test:"Relative Growth Confidence", data:{ data: outcomes,totalStudents:students.length,samplingSize:samplingSize, occurences: occurences}};

      //console.log(gains);
      return testData;
    },

    getGainProbabilities : function(currentScaledScore, currentScaledError, previousScaledScore, previousScaledError, testError, studentError){

      var samplingSize = 1000;
      var lowGain = 0;
      var averageGain = 0;
      var highGain = 0;

      if ( typeof studentError == 'undefined'){
        studentError = 0;
      }

      if ( studentError == 0){
        var randomCurrent = gaussian(parseFloat(currentScaledScore),parseFloat(testError)+parseFloat(currentScaledError));
        var randomPrevious = gaussian(parseFloat(previousScaledScore),parseFloat(testError)+parseFloat(previousScaledError));

      } else {
        //FIXME: Copy from below
      }

      for(var i=0;i<samplingSize;i++){
        if ( studentError == 0){
          var guessCurrent = parseFloat(randomCurrent());
          var guessPrevious = parseFloat(randomPrevious());
        }

      //  console.log('currentScaledScore: '+currentScaledScore+', currentScaledError:'+currentScaledError+', guessCurrent: '+guessCurrent+', previousScaledScore:'+previousScaledScore+', previousScaledError:'+previousScaledError+'  guessPrevious: '+guessPrevious);

        var theGain = this.getGain(guessCurrent,guessPrevious);

        switch( theGain){
          case 'low':
            lowGain++;
            break;

          case 'average':
            averageGain++;
            break;

          case 'high':
            highGain++;
            break;
        }

      }

      var gains = {
        lowGain: Math.round(lowGain / samplingSize * 100),
        averageGain: Math.round(averageGain / samplingSize * 100),
        highGain: Math.round(highGain / samplingSize * 100)
      };
      //console.log(gains);
      return gains;
    },

    getBandProbabilities : function(domain, year, level, scaledScore,scaledError, testError, studentError){

      //FIXME: Allow custom error

      //Get question

      if ( typeof studentError == 'undefined'){
        studentError = 0;
      }

      if ( studentError == 0){
        var random = gaussian(parseFloat(scaledScore),parseFloat(testError)+parseFloat(scaledError));
        //FIXME: Hack just in case - is this really needed, might this actually work?
        var randomMean = gaussian(1,0);
      } else {

        switch (parseInt(studentError)){

          case 1:

            //Calculate two new means +/- 1 95%
            var means = getSurroundingMeans(domain, year, level, scaledScore, 2);
            //Generate function to select one of the three means
            //var randomMean = gaussian(2,1);  //Does this work?

            var randomMean = gaussian(2,0.5);
            //Generate three random functions
            //FIXME: Get the correct scaledErrors for the new means
            var random0 = gaussian(parseFloat(means[0]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[0])));
            var random1 = gaussian(parseFloat(means[1]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[1])));
            var random2 = gaussian(parseFloat(means[2]),parseFloat(testError)+parseFloat(scaledError));
            var random3 = gaussian(parseFloat(means[3]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[3])));
            var random4 = gaussian(parseFloat(means[4]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[4])));

            var random = gaussian(parseFloat(means[2]),parseFloat(testError)+parseFloat(scaledError));
            break;

          case 2:

            //Calculate two new means +/- 1 95%
            var means = getSurroundingMeans(domain, year, level, scaledScore, 3);
            //Generate function to select one of the three means
            //var randomMean = gaussian(3,1.5);  //Does this work?
            var randomMean = gaussian(3,1);
            //Generate three random functions
            //FIXME: Get the correct scaledErrors for the new means
            var random0 = gaussian(parseFloat(means[0]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[0])));
            var random1 = gaussian(parseFloat(means[1]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[1])));
            var random2 = gaussian(parseFloat(means[2]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[2])));
            var random3 = gaussian(parseFloat(means[3]),parseFloat(testError)+parseFloat(scaledError));
            var random4 = gaussian(parseFloat(means[4]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[4])));
            var random5 = gaussian(parseFloat(means[5]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[5])));
            var random6 = gaussian(parseFloat(means[6]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[6])));

            var random = gaussian(parseFloat(means[3]),parseFloat(testError)+parseFloat(scaledError));
            break;

            case 3:

              //Calculate two new means +/- 1 95%
              var means = getSurroundingMeans(domain, year, level, scaledScore, 4);
              //Generate function to select one of the three means

              //console.log(means);
              //var randomMean = gaussian(4,2);  //Does this work?
              var randomMean = gaussian(4,1.5);  //Does this work?

              //Generate three random functions
              //FIXME: Get the correct scaledErrors for the new means
              var random0 = gaussian(parseFloat(means[0]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[0])));
              var random1 = gaussian(parseFloat(means[1]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[1])));
              var random2 = gaussian(parseFloat(means[2]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[2])));
              var random3 = gaussian(parseFloat(means[3]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[3])));
              var random4 = gaussian(parseFloat(means[4]),parseFloat(testError)+parseFloat(scaledError));
              var random5 = gaussian(parseFloat(means[5]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[5])));
              var random6 = gaussian(parseFloat(means[6]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[6])));
              var random7 = gaussian(parseFloat(means[7]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[7])));
              var random8 = gaussian(parseFloat(means[8]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[8])));

              var random = gaussian(parseFloat(means[4]),parseFloat(testError)+parseFloat(scaledError));
              break;

            case 4:

              //Calculate two new means +/- 1 95%
              var means = getSurroundingMeans(domain, year, level, scaledScore, 5);
              //Generate function to select one of the three means

              //console.log(means);
              //var randomMean = gaussian(5,2.5);  //Does this work?
              var randomMean = gaussian(5,2);  //Does this work?

              //Generate three random functions
              //FIXME: Get the correct scaledErrors for the new means
              var random0 = gaussian(parseFloat(means[0]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[0])));
              var random1 = gaussian(parseFloat(means[1]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[1])));
              var random2 = gaussian(parseFloat(means[2]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[2])));
              var random3 = gaussian(parseFloat(means[3]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[3])));
              var random4 = gaussian(parseFloat(means[4]),parseFloat(testError)+parseFloat(scaledError));
              var random5 = gaussian(parseFloat(means[5]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[5])));
              var random6 = gaussian(parseFloat(means[6]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[6])));
              var random7 = gaussian(parseFloat(means[7]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[7])));
              var random8 = gaussian(parseFloat(means[8]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[8])));
              var random9 = gaussian(parseFloat(means[9]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[9])));
              var random10 = gaussian(parseFloat(means[10]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[10])));

              var random = gaussian(parseFloat(means[4]),parseFloat(testError)+parseFloat(scaledError));
              break;

            case 5:

              //Calculate two new means +/- 1 95%
              var means = getSurroundingMeans(domain, year, level, scaledScore, 6);
              //Generate function to select one of the three means

              //console.log(means);
              //var randomMean = gaussian(5,2.5);  //Does this work?
              var randomMean = gaussian(6,2.5);  //Does this work?

              //Generate three random functions
              //FIXME: Get the correct scaledErrors for the new means
              var random0 = gaussian(parseFloat(means[0]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[0])));
              var random1 = gaussian(parseFloat(means[1]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[1])));
              var random2 = gaussian(parseFloat(means[2]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[2])));
              var random3 = gaussian(parseFloat(means[3]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[3])));
              var random4 = gaussian(parseFloat(means[4]),parseFloat(testError)+parseFloat(scaledError));
              var random5 = gaussian(parseFloat(means[5]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[5])));
              var random6 = gaussian(parseFloat(means[6]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[6])));
              var random7 = gaussian(parseFloat(means[7]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[7])));
              var random8 = gaussian(parseFloat(means[8]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[8])));
              var random9 = gaussian(parseFloat(means[9]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[9])));
              var random10 = gaussian(parseFloat(means[10]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[10])));
              var random11 = gaussian(parseFloat(means[9]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[11])));
              var random12 = gaussian(parseFloat(means[10]),parseFloat(testError)+this.getScaledError(domain,year, level, parseFloat(means[12])));

              var random = gaussian(parseFloat(means[4]),parseFloat(testError)+parseFloat(scaledError));
              break;
        }
      }

      var bands = {
        band1 : 0,
        band2 : 0,
        band3 : 0,
        band4 : 0,
        band5 : 0,
        band6 : 0,
        band7 : 0,
        band8 : 0,
        band9 : 0,
        band10 : 0};

        if ( Math.round(scaledScore) == 0){
          return bands;
        }

      var samples = 10000;
      for(var i=0; i<samples;i++){

        if ( studentError == 0){
          var guess = parseFloat(random());
        } else {


          //var studentError = parseInt(getRandomMean(domain,year,level,scaledScore,studentError));
          var randomStudentError = Math.round(randomMean());

          if ( randomStudentError < 0 ){
            randomStudentError = studentError;
          }

          if (randomStudentError > ((studentError + 1) * 2)){
            randomStudentError = studentError;
          }
//console.log('randomStudentError is '+randomStudentError+'.  studentError is '+studentError);
          switch(randomStudentError){
            case 0:
              var guess = parseFloat(random0());
              break;

            case 1:
              var guess = parseFloat(random1());
              break;

            case 2:
              var guess = parseFloat(random2());
              break;

            case 3:
              var guess = parseFloat(random3());
              break;

            case 4:
              var guess = parseFloat(random4());
              break;

            case 5:
              var guess = parseFloat(random5());
              break;

            case 6:
              var guess = parseFloat(random6());
              break;

            case 7:
              var guess = parseFloat(random7());
              break;

            case 8:
              var guess = parseFloat(random8());
              break;

            default:
              //Find out what the mean is
              //console.log('Unexpected studentError '+studentError)
              var guess = parseFloat(random());
              break;
          }
          if ( parseInt(guess) > 686){

          }
        }

        if ( guess <= 270){
          bands.band1++;
        } else {
          if ( guess <= 322){
            bands.band2++;
          } else {
            if ( guess <= 374){
              bands.band3++;
            } else {
              if ( guess <= 426){
                bands.band4++;
              } else {
                if ( guess <= 478){
                  bands.band5++;
                } else {
                  if ( guess <= 530){
                    bands.band6++;
                  } else {
                    if ( guess <= 582){
                      bands.band7++;
                    } else {
                      if ( guess <= 638){
                        bands.band8++;
                      } else {
                        if ( guess <= 686){
                          bands.band9++;
                        } else {
                        //  console.log('domain.studentError is '+domain.studentError+'.  scaledScore is '+scaledScore+'. guess is '+guess);
                          bands.band10++;
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
      bands.band1 = Math.round(bands.band1/samples*100,4);
      bands.band2 = Math.round(bands.band2/samples*100,4);
      bands.band3 = Math.round(bands.band3/samples*100,4);
      bands.band4 = Math.round(bands.band4/samples*100,4);
      bands.band5 = Math.round(bands.band5/samples*100,4);
      bands.band6 = Math.round(bands.band6/samples*100,4);
      bands.band7 = Math.round(bands.band7/samples*100,4);
      bands.band8 = Math.round(bands.band8/samples*100,4);
      bands.band9 = Math.round(bands.band9/samples*100,4);
      bands.band10 = Math.round(bands.band10/samples*100,4);

      //FIXME: Unset the bands that aren't needed.

      return bands;

    },





    getComparisonTableOld : function(domain, year, level){

      var ss = false;

      if (( domain == 'Numeracy') && (parseInt(year) == 2017) && (parseInt(level) == 5)){
        //console.log('here');
        ss = {year:2017,level:5,domain:'Numeracy',rawscores:[
          {rawScore:0,scaledScore:290,error:30,band:3},
          {rawScore:0,scaledScore:320,error:27,band:3},
          {rawScore:0,scaledScore:350,error:26,band:3},
          {rawScore:0,scaledScore:370.8,error:25,band:3},
          {rawScore:0,scaledScore:388.9,error:24,band:4},
          {rawScore:0,scaledScore:405.5,error:23,band:4},
          {rawScore:0,scaledScore:413.3,error:23,band:4},
          {rawScore:0,scaledScore:420.9,error:23,band:4},
          {rawScore:0,scaledScore:428.3,error:22,band:5},
          {rawScore:0,scaledScore:435.6,error:22,band:5},
          {rawScore:0,scaledScore:442.7,error:22,band:5},
          {rawScore:0,scaledScore:449.8,error:22,band:5},
          {rawScore:0,scaledScore:456.9,error:22,band:5},
          {rawScore:0,scaledScore:463.9,error:22,band:5},
          {rawScore:0,scaledScore:470.9,error:22,band:5},
          {rawScore:0,scaledScore:478,error:22,band:6},
          {rawScore:0,scaledScore:485.2,error:22,band:6},
          {rawScore:0,scaledScore:492.5,error:23,band:6},
          {rawScore:0,scaledScore:499.9,error:23,band:6},
          {rawScore:0,scaledScore:507.6,error:23,band:6},
          {rawScore:0,scaledScore:515.5,error:24,band:6},
          {rawScore:0,scaledScore:523.7,error:24,band:6},
          {rawScore:0,scaledScore:532.2,error:25,band:7},
          {rawScore:0,scaledScore:541.3,error:25,band:7},
          {rawScore:0,scaledScore:550.9,error:27,band:7},
          {rawScore:0,scaledScore:561,error:27,band:7},
          {rawScore:0,scaledScore:572.4,error:28,band:7},
          {rawScore:0,scaledScore:584.9,error:29,band:8},
          {rawScore:0,scaledScore:598.9,error:31,band:8},
          {rawScore:0,scaledScore:615.2,error:33,band:8},
          {rawScore:0,scaledScore:636,error:46,band:9},
          {rawScore:0,scaledScore:659.8,error:46,band:9},
          {rawScore:0,scaledScore:687,error:58,band:10},
          {rawScore:0,scaledScore:727,error:70,band:10},
          {rawScore:0,scaledScore:790,error:90,band:10},
          {rawScore:0,scaledScore:870,error:90,band:10},
          {rawScore:0,scaledScore:950,error:90,band:10},
          {rawScore:0,scaledScore:950,error:90,band:10},
          {rawScore:0,scaledScore:950,error:90,band:10}]};
      }  //Repeated the last few in case they are needed, not ideal but should be ok

      if (( domain == 'Numeracy') && (year == 2016) && (level == 3)){
        ss = {year:2015,level:3,domain:"numeracy",rawscores:[
        {rawScore:0,scaledScore:-41.26111,error:101.17043,band:1},
        {rawScore:1,scaledScore:64.72316,error:60.28885,band:1},
        {rawScore:2,scaledScore:120.65878,error:47.19793,band:1},
        {rawScore:3,scaledScore:158.08011,error:40.24141,band:1},
        {rawScore:4,scaledScore:186.38962,error:35.88278,band:1},
        {rawScore:5,scaledScore:209.47634,error:32.88914,band:1},
        {rawScore:6,scaledScore:229.22232,error:30.70742,band:1},
        {rawScore:7,scaledScore:246.67127,error:29.05957,band:1},
        {rawScore:8,scaledScore:262.46337,error:27.78225,band:1},
        {rawScore:9,scaledScore:277.02258,error:26.77937,band:2},
        {rawScore:10,scaledScore:290.64196,error:25.97886,band:2},
        {rawScore:11,scaledScore:303.53711,error:25.3411,band:2},
        {rawScore:12,scaledScore:315.87257,error:24.83546,band:2},
        {rawScore:13,scaledScore:327.77804,error:24.44091,band:3},
        {rawScore:14,scaledScore:339.35804,error:24.14184,band:3},
        {rawScore:15,scaledScore:350.69902,error:23.92746,band:3},
        {rawScore:16,scaledScore:361.87965,error:23.78933,band:3},
        {rawScore:17,scaledScore:372.96601,error:23.72328,band:3},
        {rawScore:18,scaledScore:384.02414,error:23.72628,band:4},
        {rawScore:19,scaledScore:395.1171,error:23.79894,band:4},
        {rawScore:20,scaledScore:406.30915,error:23.94367,band:4},
        {rawScore:21,scaledScore:417.66875,error:24.16527,band:4},
        {rawScore:22,scaledScore:429.27516,error:24.47033,band:5},
        {rawScore:23,scaledScore:441.21247,error:24.87569,band:5},
        {rawScore:24,scaledScore:453.59176,error:25.39154,band:5},
        {rawScore:25,scaledScore:466.54396,error:26.04312,band:5},
        {rawScore:26,scaledScore:480.23841,error:26.85984,band:6},
        {rawScore:27,scaledScore:494.90031,error:27.88194,band:6},
        {rawScore:28,scaledScore:510.83473,error:29.18508,band:6},
        {rawScore:29,scaledScore:528.48547,error:30.85695,band:6},
        {rawScore:30,scaledScore:548.51249,error:33.04708,band:6},
        {rawScore:31,scaledScore:571.95472,error:35.99327,band:6},
        {rawScore:32,scaledScore:600.52126,error:40.15133,band:6},
        {rawScore:33,scaledScore:637.21595,error:46.47129,band:6},
        {rawScore:34,scaledScore:688.49508,error:57.98703,band:6},
        {rawScore:35,scaledScore:783.13656,error:95.59452,band:6}]};
      }

      if (( domain == 'Reading') && (year == 2016) && (level == 3)){
        ss = {year:2015,level:3,domain:"reading",rawscores:[
        {rawScore:0,scaledScore:36.57564,error:99.44373,band:1},
        {rawScore:1,scaledScore:114.36941,error:58.99038,band:1},
        {rawScore:2,scaledScore:152.90644,error:46.92271,band:1},
        {rawScore:3,scaledScore:179.83453,error:40.70223,band:1},
        {rawScore:4,scaledScore:201.11253,error:36.8124,band:1},
        {rawScore:5,scaledScore:219.05092,error:34.1239,band:1},
        {rawScore:6,scaledScore:234.78509,error:32.15242,band:1},
        {rawScore:7,scaledScore:248.96617,error:30.64707,band:1},
        {rawScore:8,scaledScore:261.99502,error:29.46391,band:1},
        {rawScore:9,scaledScore:274.14408,error:28.52021,band:2},
        {rawScore:10,scaledScore:285.60234,error:27.75207,band:2},
        {rawScore:11,scaledScore:296.51308,error:27.1245,band:2},
        {rawScore:12,scaledScore:306.9846,error:26.61129,band:2},
        {rawScore:13,scaledScore:317.10365,error:26.19493,band:2},
        {rawScore:14,scaledScore:326.94222,error:25.86265,band:3},
        {rawScore:15,scaledScore:336.56218,error:25.60436,band:3},
        {rawScore:16,scaledScore:346.01534,error:25.41333,band:3},
        {rawScore:17,scaledScore:355.35279,error:25.28553,band:3},
        {rawScore:18,scaledScore:364.61694,error:25.21692,band:3},
        {rawScore:19,scaledScore:373.85283,error:25.20751,band:3},
        {rawScore:20,scaledScore:383.10217,error:25.25661,band:4},
        {rawScore:21,scaledScore:392.40936,error:25.3649,band:4},
        {rawScore:22,scaledScore:401.81879,error:25.53508,band:4},
        {rawScore:23,scaledScore:411.37755,error:25.77252,band:4},
        {rawScore:24,scaledScore:421.14145,error:26.07991,band:4},
        {rawScore:25,scaledScore:431.16701,error:26.46802,band:5},
        {rawScore:26,scaledScore:441.52351,error:26.94558,band:5},
        {rawScore:27,scaledScore:452.293,error:27.52741,band:5},
        {rawScore:28,scaledScore:463.57234,error:28.23098,band:5},
        {rawScore:29,scaledScore:475.48463,error:29.08253,band:5},
        {rawScore:30,scaledScore:488.18861,error:30.12645,band:6},
        {rawScore:31,scaledScore:501.89682,error:31.41454,band:6},
        {rawScore:32,scaledScore:516.90388,error:33.03625,band:6},
        {rawScore:33,scaledScore:533.64768,error:35.13284,band:6},
        {rawScore:34,scaledScore:552.81496,error:37.95318,band:6},
        {rawScore:35,scaledScore:575.59898,error:41.97148,band:6},
        {rawScore:36,scaledScore:604.36268,error:48.36954,band:6},
        {rawScore:37,scaledScore:645.15033,error:60.63093,band:6},
        {rawScore:38,scaledScore:725.67364,error:101.63584,band:6}]};
      }

      if (( domain == 'Spelling') && (year == 2016) && (level == 3)){
        ss = {year:2015,level:3,domain:"spelling",rawscores:[
        {rawScore:0,scaledScore:182.95034,error:61.60665,band:1},
        {rawScore:1,scaledScore:240.43482,error:37.80687,band:1},
        {rawScore:2,scaledScore:272.31965,error:30.92908,band:2},
        {rawScore:3,scaledScore:296.25472,error:27.42959,band:2},
        {rawScore:4,scaledScore:316.08247,error:25.25094,band:2},
        {rawScore:5,scaledScore:333.3722,error:23.76967,band:3},
        {rawScore:6,scaledScore:348.9726,error:22.71636,band:3},
        {rawScore:7,scaledScore:363.4206,error:21.95686,band:3},
        {rawScore:8,scaledScore:377.0729,error:21.402,band:4},
        {rawScore:9,scaledScore:390.17149,error:20.9992,band:4},
        {rawScore:10,scaledScore:402.88023,error:20.71072,band:4},
        {rawScore:11,scaledScore:415.31192,error:20.51294,band:4},
        {rawScore:12,scaledScore:427.55573,error:20.39556,band:5},
        {rawScore:13,scaledScore:439.69361,error:20.35707,band:5},
        {rawScore:14,scaledScore:451.81586,error:20.40357,band:5},
        {rawScore:15,scaledScore:464.02919,error:20.54647,band:5},
        {rawScore:16,scaledScore:476.46279,error:20.80104,band:5},
        {rawScore:17,scaledScore:489.27175,error:21.18631,band:6},
        {rawScore:18,scaledScore:502.64662,error:21.72821,band:6},
        {rawScore:19,scaledScore:516.82062,error:22.4637,band:6},
        {rawScore:20,scaledScore:532.09062,error:23.45109,band:6},
        {rawScore:21,scaledScore:548.86552,error:24.81003,band:6},
        {rawScore:22,scaledScore:567.80801,error:26.80538,band:6},
        {rawScore:23,scaledScore:590.28162,error:30.07164,band:6},
        {rawScore:24,scaledScore:619.96951,error:36.6659,band:6},
        {rawScore:25,scaledScore:674.54975,error:59.84414,band:6}]};
      }

      if (( domain == 'Grammar') && (year == 2016) && (level == 3)){
        ss = {year:2016,level:3,domain:"grammar",rawscores:[
          {rawScore:0,scaledScore:-3.07166,error:114.47409,band:1},
          {rawScore:1,scaledScore:102.95186,error:69.09445,band:1},
          {rawScore:2,scaledScore:158.90849,error:55.51268,band:1},
          {rawScore:3,scaledScore:199.18486,error:48.38074,band:1},
          {rawScore:4,scaledScore:231.26277,error:43.79934,band:1},
          {rawScore:5,scaledScore:258.24697,error:40.58581,band:1},
          {rawScore:6,scaledScore:281.79566,error:38.21757,band:2},
          {rawScore:7,scaledScore:302.9254,error:36.43807,band:2},
          {rawScore:8,scaledScore:322.29548,error:35.06799,band:3},
          {rawScore:9,scaledScore:340.37119,error:34.01764,band:3},
          {rawScore:10,scaledScore:357.49357,error:33.22455,band:3},
          {rawScore:11,scaledScore:373.92503,error:32.65197,band:3},
          {rawScore:12,scaledScore:389.87505,error:32.26608,band:4},
          {rawScore:13,scaledScore:405.52444,error:32.05292,band:4},
          {rawScore:14,scaledScore:421.03859,error:32.00441,band:4},
          {rawScore:15,scaledScore:436.57405,error:32.12201,band:5},
          {rawScore:16,scaledScore:452.29474,error:32.41676,band:5},
          {rawScore:17,scaledScore:468.38074,error:32.90996,band:5},
          {rawScore:18,scaledScore:485.0452,error:33.63837,band:6},
          {rawScore:19,scaledScore:502.55935,error:34.66005,band:6},
          {rawScore:20,scaledScore:521.29217,error:36.06027,band:6},
          {rawScore:21,scaledScore:541.77141,error:37.99853,band:6},
          {rawScore:22,scaledScore:564.83425,error:40.74164,band:6},
          {rawScore:23,scaledScore:591.92429,error:44.84454,band:6},
          {rawScore:24,scaledScore:625.9706,error:51.50606,band:6},
          {rawScore:25,scaledScore:674.47924,error:64.59684,band:6},
          {rawScore:26,scaledScore:772.24035,error:108.72988,band:6}]};
      }

      if (( domain == 'Reading') && (year == 2015) && (level == 3)){
        ss = {year:2015,level:3,domain:"reading",rawscores:[
          {rawScore:0,scaledScore:-81.18652,error:101.10984,band:1},
          {rawScore:1,scaledScore:21.128,error:60.31412,band:1},
          {rawScore:2,scaledScore:72.77662,error:48.17112,band:1},
          {rawScore:3,scaledScore:109.26212,error:41.88471,band:1},
          {rawScore:4,scaledScore:138.29219,error:37.96395,band:1},
          {rawScore:5,scaledScore:162.85801,error:35.23374,band:1},
          {rawScore:6,scaledScore:184.45618,error:33.21787,band:1},
          {rawScore:7,scaledScore:203.93825,error:31.66476,band:1},
          {rawScore:8,scaledScore:221.8383,error:30.43116,band:1},
          {rawScore:9,scaledScore:238.5108,error:29.42961,band:1},
          {rawScore:10,scaledScore:254.20798,error:28.6016,band:1},
          {rawScore:11,scaledScore:269.11347,error:27.91148,band:1},
          {rawScore:12,scaledScore:283.36853,error:27.32966,band:2},
          {rawScore:13,scaledScore:297.0828,error:26.83796,band:2},
          {rawScore:14,scaledScore:310.34708,error:26.42362,band:2},
          {rawScore:15,scaledScore:323.23804,error:26.07789,band:3},
          {rawScore:16,scaledScore:335.81893,error:25.79202,band:3},
          {rawScore:17,scaledScore:348.15161,error:25.56467,band:3},
          {rawScore:18,scaledScore:360.28318,error:25.3871,band:3},
          {rawScore:19,scaledScore:372.26878,error:25.26266,band:3},
          {rawScore:20,scaledScore:384.15349,error:25.18867,band:4},
          {rawScore:21,scaledScore:395.98507,error:25.16648,band:4},
          {rawScore:22,scaledScore:407.81328,error:25.19742,band:4},
          {rawScore:23,scaledScore:419.68655,error:25.28419,band:4},
          {rawScore:24,scaledScore:431.6614,error:25.43217,band:5},
          {rawScore:25,scaledScore:443.79767,error:25.64673,band:5},
          {rawScore:26,scaledScore:456.16264,error:25.93664,band:5},
          {rawScore:27,scaledScore:468.83433,error:26.31197,band:5},
          {rawScore:28,scaledScore:481.9096,error:26.78886,band:6},
          {rawScore:29,scaledScore:495.50145,error:27.3875,band:6},
          {rawScore:30,scaledScore:509.75651,error:28.13345,band:6},
          {rawScore:31,scaledScore:524.86514,error:29.06572,band:6},
          {rawScore:32,scaledScore:541.08226,error:30.23609,band:6},
          {rawScore:33,scaledScore:558.76236,error:31.74817,band:6},
          {rawScore:34,scaledScore:578.44151,error:33.73579,band:6},
          {rawScore:35,scaledScore:600.96455,error:36.45187,band:6},
          {rawScore:36,scaledScore:627.81261,error:40.38138,band:6},
          {rawScore:37,scaledScore:661.96677,error:46.64963,band:6},
          {rawScore:38,scaledScore:711.09706,error:58.77245,band:6},
          {rawScore:39,scaledScore:810.68137,error:99.26952,band:6}]};
      }

      return ss;
    },

    getScaledScore : function(domain, year, level, score){
      //Takes a rawscore and gets a scaled score

     var ss = tableService.getEquivalenceTable(domain,year,level);

     if ( ss !== false){
       //Find it.

       var found = false;
       for(var i=0;i<ss.length;i++){
         if ( Math.round(ss[i].rawScore) == Math.round(score) ){

           found = true;
           return ss[i].scaledScore;
         }

       }

       //This should not be needed!
       if ( found == false){
         return false;
       }

     } else {

       return false;
     }

   },

     getScaledError : function(domain, year, level, score){

      //FIXME: Need to get this to work. Will need to approximate scaled errors for 2017 until available in Decemnber

      /*
        Year 3 - results will be reported in Band 1 to Band 6
        Year 5 - results will be reported in Band 3 to Band 8
      */

      var ss = tableService.getEquivalenceTable(domain,year,level);
      /*
      • Band 1 - scaled scores ≤ 270
      • Band 2 - scaled scores > 270 and ≤ 322
      • Band 3 - scaled scores > 322 and ≤ 374
      • Band 4 - scaled scores > 374 and ≤ 426
      • Band 5 - scaled scores > 426 and ≤ 478
      • Band 6 - scaled scores > 478 and ≤ 530
      • Band 7 - scaled scores > 530 and ≤ 582
      • Band 8 - scaled scores > 582 and ≤ 634
      • Band 9 - scaled scores > 634 and ≤ 686
      • Band 10 - scaled scores > 686

      */



      if ( ss !== false){
        //Find it.

        var found = false;
        for(var i=0;i<ss.length;i++){
        //  console.log('comparing '+ss[i].scaledScore+' and '+score);
          if ( Math.round(ss[i].scaledScore) == Math.round(score) ){
          //  console.log('match');
            found = true;
            return ss[i].error;
          }

        }

        //This should not be needed!
        if ( found == false){
          return 22;
        }

      } else {

        return 22;
      }

    },

    getBand : function(scaledScore){

      scaledScore = parseFloat(scaledScore);

      if ( Math.round(scaledScore) == 0){
        console.log('scaledScore is 0');
        return 'NA';
      }

      if ( scaledScore <= 270){
        return 1;
      } else {
        if ( scaledScore <= 322){
            return 2;
        } else {
          if ( scaledScore <= 374){
            return 3;
          } else {
            if ( scaledScore <= 426){
              return 4;
            } else {
              if ( scaledScore <= 478){
                return 5;
              } else {
                if ( scaledScore <= 530){
                  return 6;
                } else {
                  if ( scaledScore <= 582){
                    return 7;
                  } else {
                    if ( scaledScore <= 638){
                      return 8;
                    } else {
                      if ( scaledScore <= 686){
                        return 9;
                      } else {
                        return 10;
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
  }
});
