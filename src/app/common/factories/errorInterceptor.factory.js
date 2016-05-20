(function() {

  angular.module('fuse').factory('errorInterceptor', errorInterceptor);

  function errorInterceptor($q, $location) {
    return function(promise) {
      return promise.then(function (response) {
        return response;
      },
      function (response) {

        if(response.status === 500) {
          $location.url('/errors/error-500');
        }
        return $q.reject(response);
      });

    };
  }

})();
