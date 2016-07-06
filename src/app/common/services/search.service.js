(function() {

    angular
        .module('app.core')
        .service('SearchService', SearchService);

    SearchService.$inject = ['msNavigationService', '$q', '$rootScope'];

    function SearchService(msNavigationService, $q, $rootScope) {

      var data = [];
      var srcData = [];

      function setData(d) {
        data = d;
      }

      function getResult() {
        return srcData;
      }


      function subscribe(scope, callback) {
            var handler = $rootScope.$on('notifying-service-event', callback);
            scope.$on('$destroy', handler);
          }

      function search(query)
      {

          var flatNavigation = data,
              deferred = $q.defer();

          if ( query )
          {
              srcData = flatNavigation.filter(function (item)
              {
                  if ( angular.lowercase(item.title).search(angular.lowercase(query)) > -1 )
                  {
                      return true;
                  }
              });
          } else if(query == "") {
            srcData = flatNavigation;
          }

          $rootScope.$emit('notifying-service-event');

          deferred.resolve(srcData);


          return deferred.promise;
      }

      return {
        setData : setData,
        getResult : getResult,
        search : search,
        subscribe : subscribe
      }

    }

})();
