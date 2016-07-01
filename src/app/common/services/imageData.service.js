(function() {

    angular
        .module('app.core')
        .service('imageData', imageData);

    function imageData($http) {

      var imgStore = {};

      var links = ['transperent_logo', 'apila_logo', 'apila_form'];

        $http.get('https://s3-us-west-2.amazonaws.com/apilatest2/' + links[0])
        .success(function(response) {
          imgStore[links[0]] = response;
        });

        $http.get('https://s3-us-west-2.amazonaws.com/apilatest2/' + links[1])
        .success(function(response) {
          imgStore[links[1]] = response;
        });

        $http.get('https://s3-us-west-2.amazonaws.com/apilatest2/' + links[2])
        .success(function(response) {
          imgStore[links[2]] = response;
        });


        // replace the 'n'th character of 's' with 't'
  function replaceAt(s, n, t) {
      return s.substring(0, n) + t + s.substring(n + 1);
  }


      function getImage(image) {
        return replaceAt(imgStore[image], imgStore[image].length-1, '');
      }


    	return {
    	  getImage: getImage
    	}

    }
  })();
