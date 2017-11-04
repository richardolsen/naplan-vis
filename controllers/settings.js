naplanApp.controller('SettingsController', function($scope, dataService) {

  $scope.setting = {};
  $scope.setting.useLS = dataService.usingLocalStorage();
  console.log($scope.setting.useLS);

  $scope.updateSettings = function(){
    if($scope.setting.useLS == true){
      dataService.useLocalStorage();
    } else {
      console.log('deleting');
      dataService.deleteLocalStorage();
    }
  };
});
