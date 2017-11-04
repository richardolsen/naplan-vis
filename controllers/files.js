naplanApp.controller('FilesController', function($scope, dataService) {
  /*
    Enables the loading of the NAPLAN csv files to the browser.
  */

  $scope.data = dataService.getData();

  function printTable(file) {

    $scope.html = 'Loading.........';
    var reader = new FileReader();
    reader.readAsText(file);
    reader.fileName = file.name
    reader.onload = function(event){
      var csv = event.target.result;
      var set = $.csv.toArrays(csv);
      //$scope.data.sets.push(set);

      $scope.data = dataService.parseData(set, reader.fileName);
      $scope.$apply();
    };
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
  }

  $scope.nowFileUpload = function(evt){

    var files = event.target.files;
    var file = files[0];
    printTable(file);
  };

/*
  //Test Only
  <plotly plotly-data="plotlyData" plotly-layout="layout" plotly-options="options" ></plotly>
  
  $scope.plotlyData = [{x: [1, 2, 3, 4, 5],
                    y: [1, 2, 4, 8, 16]}];
    $scope.layout = {height: 600, width: 1000, title: 'foobar'};
    $scope.options = {showLink: false, displayLogo: false};

*/

});
