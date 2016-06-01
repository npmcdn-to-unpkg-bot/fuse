(function ()
{
    'use strict';

    angular
        .module('app.residents')
        .controller('ComposeDialogController', ComposeDialogController);

    /** @ngInject */
    function ComposeDialogController($mdDialog, apilaData, resList, authentication)
    {
        var vm = this;

        // Methods
        vm.closeDialog = closeDialog;
        vm.addResident = addResident;

        //////////
         vm.residentList = resList;

         apilaData.userCommunity(authentication.currentUser().name)
           .success(function(d) {
             vm.community = d;

           });

        function closeDialog()
        {
            $mdDialog.hide();
        }

        function addResident()
        {
          vm.form.community =  vm.community;
          apilaData.addResident(vm.form)
          .success(function(data) {
                vm.residentList.push(data);
                $mdDialog.hide();
          })
          .error(function() {
            console.log("Error while adding resident");
          });
        }
    }
})();
