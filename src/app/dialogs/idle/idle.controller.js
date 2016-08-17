(function ()
{
    'use strict';

    angular
        .module('fuse')
        .controller('IdleController', IdleController);

    /** @ngInject */
    function IdleController($mdDialog, $state, Idle, $scope, authentication)
    {
      //Data
      var vm = this;

      //When the user has gone idle
      $scope.$on('IdleTimeout', function() {

        if(authentication.isLoggedIn()) {
          authentication.logout();

          $state.go('app.pages_auth_login');

          $mdDialog.hide();
        }
       });

       $scope.$on('IdleEnd', function() {
         $mdDialog.hide();
       });

    }

})();
