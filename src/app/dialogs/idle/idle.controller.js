(function ()
{
    'use strict';

    angular
        .module('fuse')
        .controller('IdleController', IdleController);

    /** @ngInject */
    function IdleController($mdDialog, $window, Idle, $scope, authentication)
    {
      //Data
      var vm = this;

      //When the user has gone idle
      $scope.$on('IdleTimeout', function() {

        if(authentication.isLoggedIn()) {
          authentication.logout();

          $window.location.reload();

          $mdDialog.hide();
        }
       });

       $scope.$on('IdleEnd', function() {
         $mdDialog.hide();
       });

    }

})();
