(function() {

    angular
        .module('app.core')
        .service('SearchService', SearchService);

    SearchService.$inject = ['msNavigationService', '$q', '$rootScope'];

    function SearchService(msNavigationService, $q, $rootScope) {

      // The data that is being set through filter/search
      var data = [];

      // The resulting data from the filter/search function
      var resultData = [];


      function setData(d) {
        data = d;
      }

      function getResult() {
        return resultData;
      }

      function subscribe(scope, callback) {
        var handler = $rootScope.$on('notifying-service-event', callback);
        scope.$on('$destroy', handler);
      }

      function search(query)
      {

          var deferred = $q.defer();

          if ( query )
          {
              resultData = data.filter(function (item)
              {
                  if ( angular.lowercase(item.title).search(angular.lowercase(query)) > -1 )
                  {
                      return true;
                  }
              });
          } else if(query == "") {
            resultData = data;
          }

          // notify the controller to update their data
          $rootScope.$emit('notifying-service-event');

          deferred.resolve(resultData);

          return deferred.promise;
      }

      function collapseSearch() {
        resultData = data;
        $rootScope.$emit('notifying-service-event');
      }

      function searchResultClick(item) {

      }

      return {
        setData : setData,
        getResult : getResult,
        search : search,
        subscribe : subscribe,
        searchResultClick : searchResultClick,
        collapseSearch : collapseSearch
      }

    }

})();
