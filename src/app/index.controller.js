(function ()
{
    'use strict';

    angular
        .module('fuse')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming, Idle, $scope, $mdDialog, authentication)
    {
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;

        // Fuctions

        // start the idle time only if we are logged in already
        // idle timer is also started in dashboard
        if(authentication.isLoggedIn()) {
            Idle.watch();
        }

        //When the user has gone idle
        $scope.$on('IdleTimeout', function() {

          if(authentication.isLoggedIn()) {
            authentication.logout();

            $mdDialog.show({
                controller         : 'IdleController',
                controllerAs       : 'vm',
                templateUrl        : 'app/dialogs/idle/idle-dialog.html',
                clickOutsideToClose: false
            });
          }

         });

    }
})();
