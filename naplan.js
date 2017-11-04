var naplanApp = angular.module('naplanApp', ['ngRoute','ngResource', 'ngSanitize','plotly', 'ngTouch', 'ngAnimate','ui.bootstrap'],
function($locationProvider, $resourceProvider){
  $locationProvider.html5Mode(true).hashPrefix('!');
  $resourceProvider.defaults.stripTrailingSlashes = false;
})
.config( function($routeProvider) {

  $routeProvider
  .when("/", {templateUrl:function(params) {
            params.page = 'files';
            return  'partials/files.html'},
          controller: 'FilesController'
        })
  .when("/report/d/:domain/y/:year/l/:level", {templateUrl:function(params) {
                params.page = 'domain';
                return  'partials/domain.html'},
              controller: 'NaplanController'
            })
  .when("/matched-cohort/d/:domain/y/:year/l/:level", {templateUrl:function(params) {
                params.page = 'matched-cohort';
                return  'partials/matched-cohort.html'},
              controller: 'NaplanController'
            })
  .when("/matched-cohort-map/d/:domain/y/:year/l/:level", {templateUrl:function(params) {
                params.page = 'matched-cohort-map';
                return  'partials/matched-cohort-map.html'},
              controller: 'NaplanController'
            })
  .when("/student/:casesId/d/:domain/y/:year/l/:level", {templateUrl:function(params) {
                params.page = 'student';
                return  'partials/student.html'},
              controller: 'NaplanController'
            })
  .when("/reports", {templateUrl:function(params) {
            params.page = 'reports';
            return  'partials/reports.html'},
          controller: 'NaplanController'
        })
  .when("/settings", {templateUrl:function(params) {
            params.page = 'settings';
            return  'partials/settings.html'},
          controller: 'SettingsController'
        })
  .when("/data-tables", {templateUrl:function(params) {
            params.page = 'data-tables';
            params.domain = false;
            params.year = false;
            params.level = false;
            return  'partials/data-tables.html'},
          controller: 'NaplanController'
        })
  .when("/equivalence-table/d/:domain/y/:year/l/:level", {templateUrl:function(params) {
            params.page = 'equivalence-table';
            return  'partials/equivalence-table.html'},
          controller: 'NaplanController'
        })
  .when("/student-response/d/Writing/y/:year/l/:level/q/:question", {templateUrl:function(params) {
            params.page = 'student-response-writing-question';
            params.domain = 'Writing';
            return  'partials/student-response-writing-question.html'},
          controller: 'NaplanController'
        })
  .when("/student-response/d/Writing/y/:year/l/:level", {templateUrl:function(params) {
            params.page = 'student-response-writing';
            params.domain = 'Writing';
            return  'partials/student-response-writing.html'},
          controller: 'NaplanController'
        })
  .when("/student-response/d/:domain/y/:year/l/:level", {templateUrl:function(params) {
            params.page = 'student-response';
            return  'partials/student-response.html'},
          controller: 'NaplanController'
        })
  .when("/student-response/d/:domain/y/:year/l/:level/q/:question", {templateUrl:function(params) {
            params.page = 'student-response-question';
            return  'partials/student-response-question.html'},
          controller: 'NaplanController'
        })
  .when("/getting-started", {templateUrl:function(params) {
            params.page = 'getting-started';
            return  'partials/getting-started.html'},
          controller: 'SettingsController'
        });

}).directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
});
