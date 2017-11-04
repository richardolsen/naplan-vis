naplanApp.controller('MenuController', function($scope,dataService, $location) {
  console.log('MenuController loaded.');
  
  $scope.hasData = function(){
    return dataService.hasData();
  };

  $scope.go = function(path){
    $location.path(path);
  };

})
