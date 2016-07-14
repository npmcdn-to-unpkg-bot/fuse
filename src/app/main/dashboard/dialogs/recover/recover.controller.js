(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('RecoverController', RecoverController);

    /** @ngInject */
    function RecoverController($mdDialog) {

      var vm = this;

      vm.closeDialog = closeDialog;

      function closeDialog()
      {
          $mdDialog.hide();
      }
    }

})();
