(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('UpdateBillingController', UpdateBillingController);

    /** @ngInject */
    function UpdateBillingController($mdDialog, apilaData, authentication, $mdToast) {

      var vm = this;

      vm.closeDialog = closeDialog;

      function closeDialog()
      {
          $mdDialog.hide();
      }

    }

})();
