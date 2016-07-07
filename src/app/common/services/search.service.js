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

      var searchBy = [];

      var unfiltered = [];

      function setData(d, searchParams) {
        data = d;
        searchBy = searchParams;
      }

      function getUnfiltered() {
        return unfiltered;
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

          unfiltered = [];
          var deferred = $q.defer();

          if ( query )
          {
              resultData = data.filter(function (item)
              {

                  for(var i = 0; i < searchBy.length; ++i) {
                    if(item[searchBy[i]] !== undefined) {
                      if ( angular.lowercase(item[searchBy[i]].toString()).search(angular.lowercase(query)) > -1 ) {
                        return true;
                      }
                    }
                  }

                  // searching of nested fields
                  if(item.residentGoing !== undefined) {
                    if ( angular.lowercase(item.residentGoing.firstName + item.residentGoing.lastname).search(angular.lowercase(query)) > -1 ) {
                      return true;
                    }
                  }

                //  unfiltered.push(item.id);


              });
          } else if(query == "") {

            resultData = removeDueDate();
          }

          // notify the controller to update their data
          $rootScope.$emit('notifying-service-event');

          deferred.resolve(resultData);

          return deferred.promise;
      }

      //remove due date, temp function while the calendar is sorted out
      function removeDueDate() {
        var tmp = [];
        for(var i = 0; i  < data.length; ++i) {
          if(data[i].color === undefined) {
            tmp.push(data[i]);
          }
        }

        return tmp;
      }

      function collapseSearch() {
        resultData = removeDueDate();
        $rootScope.$emit('notifying-service-event');
      }

      function searchResultClick(item) {

      }

      return {
        setData : setData,
        getResult : getResult,
        getUnfiltered : getUnfiltered,
        search : search,
        subscribe : subscribe,
        searchResultClick : searchResultClick,
        collapseSearch : collapseSearch
      }

    }

})();
