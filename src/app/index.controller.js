(function ()
{
    'use strict';

    angular
        .module('fuse')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming, Idle, $scope, $mdDialog, authentication, $state, $window)
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

        // $window.onbeforeunload = function() {
        //
        //   authentication.logout();
        //
        // };

        $scope.$on('IdleStart', function() {

          if(authentication.isLoggedIn()) {

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
