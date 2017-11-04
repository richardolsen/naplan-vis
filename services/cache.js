"use strict";

naplanApp.service('cacheService', function (localStorageService) {

  /*

    Use cacheService.set({function name},{arguments as an array},data) to prime the cache
    Use cacheService.get({function name},{arguments as an array}) to retrieve data

  */
  function isJson(str) {
      try {
          return true;
      } catch (e) {
          return false;
      }
  }

  return{
      get(obj,args){
        var j = angular.toJson(args);

        var cache = localStorageService.get(obj+'_'+j);
        //console.log(cache);
        if ( cache == null ){
          return false;
        } else {
          return angular.fromJson(cache);
        }
      },

      set(obj,args,val){
        var j = angular.toJson(args);

        var cache = localStorageService.set(obj+'_'+j,angular.toJson(val));

        return true;
      }
  }
});
