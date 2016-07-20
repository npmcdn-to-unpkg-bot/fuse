(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('RecoverController', RecoverController);

    /** @ngInject */
    function RecoverController($mdDialog, recoveryInfo) {

      var vm = this;

      // Data
      vm.recoveryInfo = recoveryInfo;

      // Functions 
      vm.closeDialog = closeDialog;

      function closeDialog()
      {
          $mdDialog.hide();
      }
    }

})();
