(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('RecoverController', RecoverController);

    /** @ngInject */
    function RecoverController($mdDialog, recoveryInfo, apilaData) {

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
        data.type = "boss";

        apilaData.verifyPassword(data, vm.recoveryInfo.bossId)
        .success(function(response) {
          closeDialog();
          console.log(response);
        })
        .error(function(response) {
          console.log(response);
        });
      }

    }

})();
