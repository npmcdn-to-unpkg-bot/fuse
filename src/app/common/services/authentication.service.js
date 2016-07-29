(function() {

    angular
        .module('app.core')
        .service('authentication', authentication);

    authentication.$inject = ['$http', '$window'];

    function authentication($http, $window) {

       var apiUrl="http://localhost:3300";

       var userImage = "https://s3-us-west-2.amazonaws.com/apilatest2/logo.png";

        // create a saveToken method to read a value from localStorage
        var saveToken = function(token) {
            $window.localStorage['apila-token'] = token;
        };

        // create a getToken method to read a value from localStorage
        var getToken = function() {
            return $window.localStorage['apila-token'];
        };

        var isLoggedIn = function() {
            var token = getToken();

            if (token) {
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        var currentUser = function() {
            if (isLoggedIn()) {
                var token = getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return {
                    email: payload.email,
                    name: payload.name,
                    id: payload._id
                };
            }
        };

        var getUserImage = function() {
          if(userImage === "") {
            return "https://s3-us-west-2.amazonaws.com/apilatest2/logo.png";
          } else {
            return userImage;
          }

        }

        var setUserImage = function(image) {
          userImage = image;
        }

        register = function(user) {
            return $http.post(apiUrl + '/api/register', user).success(function(data) {
                saveToken(data.token);
            });
        };

        login = function(user) {
            return $http.post(apiUrl + '/api/login', user).success(function(data) {
                saveToken(data.token);

            });
        };

        logout = function() {
            $window.localStorage.removeItem('apila-token');
        };


        if (isLoggedIn()) {
          $http.get(apiUrl + '/api/users/' + currentUser().name + "/image")
          .success(function(response) {
            userImage = response;
          })
          .error(function(response) {
            console.log("Unable to load user image")
          });
        }

        // expose methods to application
        return {
            currentUser: currentUser,
            saveToken: saveToken,
            getToken: getToken,
            isLoggedIn: isLoggedIn,
            register: register,
            login: login,
            logout: logout,
            getUserImage: getUserImage,
            setUserImage: setUserImage
        };
    }


})();
