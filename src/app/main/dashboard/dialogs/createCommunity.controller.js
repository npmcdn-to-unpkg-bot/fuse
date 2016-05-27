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

      vm.username = authentication.currentUser().name;

      function closeDialog()
      {
          $mdDialog.hide();
      }

      function addCommunity()
      {
        vm.form.communityMembers = [];
        vm.form.pendingMembers = [];

        vm.form.username = vm.username;

        apilaData.addCommunity(vm.form)
        .success(function(d) {
          closeDialog();
        })
        .error(function(d) {
          console.log("Error while creating community");
        });
      }

  }

})();
