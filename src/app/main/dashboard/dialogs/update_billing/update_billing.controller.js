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
      vm.updateCustomer = updateCustomer;

      vm.userid = authentication.currentUser().id;

      function closeDialog()
      {
          $mdDialog.hide();
      }

      function updateCustomer() {
        Stripe.card.createToken(vm.cardInfo,
          function(status, response) {

            console.log(response);

            if(status !== 200) {
              showErrorToast(response.error.message);
            } else {
              apilaData.updateCustomer(vm.userid, response)
              .success(function(response) {
                console.log(response);
                closeDialog();
              })
              .error(function(response) {
                console.log(response);
              });
            }



          });
      }

      function showErrorToast(errorMsg) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(errorMsg)
            .position("top right")
            .hideDelay(3000)
        );
      }

    }

})();
