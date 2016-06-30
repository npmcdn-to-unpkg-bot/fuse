(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.reset-password')
        .controller('ResetPasswordController', ResetPasswordController);

    /** @ngInject */
    function ResetPasswordController(apilaData, $state, $stateParams, $mdToast)
    {
        // Data
        var vm = this;

        // Methods
        vm.resetPassword = function() {
          apilaData.resetPassword($stateParams.token, vm.form)
          .success(function(response) {
            $state.go('app.pages_auth_login');
          })
          .error(function(response) {
            $mdToast.show(
              $mdToast.simple()
              .textContent("Failed reseting password")
              .position("top right")
              .hideDelay(2000)
            );
          });
        }

        //////////
    }
})();
