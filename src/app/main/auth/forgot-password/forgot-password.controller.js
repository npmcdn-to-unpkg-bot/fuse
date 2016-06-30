(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.forgot-password')
        .controller('ForgotPasswordController', ForgotPasswordController);

    /** @ngInject */
    function ForgotPasswordController(apilaData, $mdToast, $state, $interval)
    {
        // Data
        var vm = this;

        // Methods
        vm.sendMail = function() {
          apilaData.forgotPassword(vm.form.email)
          .success(function(response) {
            $mdToast.show(
              $mdToast.simple()
              .textContent("Email with password reset has been sent to you")
              .position("top right")
              .hideDelay(2000)
            );

            vm.form.email = "";

            $interval(function () {
              $state.go('app.pages_auth_login');
            }, 1500);
          })
          .error(function(response) {
            $mdToast.show(
              $mdToast.simple()
              .textContent("Email not found")
              .position("top right")
              .hideDelay(2000)
            );
          });
        }

        //////////
    }
})();
