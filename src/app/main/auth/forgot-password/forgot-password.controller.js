(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.forgot-password')
        .controller('ForgotPasswordController', ForgotPasswordController);

    /** @ngInject */
    function ForgotPasswordController(apilaData, $mdToast)
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
          })
          .error(function(response) {
            console.log("Email password reset not sent");
          });
        }

        //////////
    }
})();
