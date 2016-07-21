(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('RecoverController', RecoverController);

    /** @ngInject */
    function RecoverController($mdDialog, recoveryInfo, apilaData, $mdToast) {

      var vm = this;

      // Data
      vm.recoveryInfo = recoveryInfo;

      // Functions
      vm.closeDialog = closeDialog;
      vm.verifyPassword = verifyPassword;

      function closeDialog()
      {
          $mdDialog.hide();
      }

      function verifyPassword() {

        var data = {};
        data.password = vm.form.password;
        data.recoveryid = vm.recoveryInfo.recoveryid;
        data.type = vm.recoveryInfo.type;

        apilaData.verifyPassword(data, vm.recoveryInfo.bossId)
        .success(function(response) {
          closeDialog();

          $mdToast.show(
            $mdToast.simple()
              .textContent("Your password has been verified")
              .position("top right")
              .hideDelay(2000)
          );
        })
        .error(function(response) {

          $mdToast.show(
            $mdToast.simple()
              .textContent("Your password doesn't match!")
              .position("top right")
              .hideDelay(2000)
          );
        });
      }

    }

})();
