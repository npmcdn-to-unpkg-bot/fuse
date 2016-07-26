(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('CreateCommunityController', CreateCommunityController);

    /** @ngInject */
    function CreateCommunityController($mdDialog, apilaData, authentication) {

      var vm = this;

      //Functions
      vm.closeDialog = closeDialog;
      vm.addCommunity = addCommunity;

      vm.form = {};

      vm.cardInfo = {
        "number" : "4242424242424242",
        "exp_month" : "11",
        "exp_year" : "2018",
        "cvc" : "432"
      }

      vm.username = authentication.currentUser().name;
      vm.userid = authentication.currentUser().id;

      function closeDialog()
      {
          $mdDialog.hide();
      }


      function addCommunity()
      {
        vm.form.communityMembers = [];
        vm.form.pendingMembers = [];

        vm.form.username = vm.username;

        console.log(vm.cardInfo);
        console.log(vm.userid);

        Stripe.card.createToken(vm.cardInfo,
          function(status, response) {
            console.log(status);
            console.log(response);

            apilaData.saveCreditCard(vm.userid, response)
            .success(function(response) {
              console.log(response);
              closeDialog();
            })
            .error(function(response) {
              console.log(response);
            });
          });

        // apilaData.addCommunity(vm.form)
        // .success(function(d) {
        //   closeDialog();
        // })
        // .error(function(d) {
        //   console.log("Error while creating community");
        // });
      }

  }

})();
