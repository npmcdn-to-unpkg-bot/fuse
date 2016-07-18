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

       vm.autocompleteOptions = {
                       componentRestrictions: { country: 'us' }
        }

        function closeDialog()
        {
            $mdDialog.hide();
        }

        function addResident()
        {
          vm.form.community =  vm.community;
          console.log(vm.form.movedFrom.geometry.location.lat());
          console.log(vm.form.movedFrom.geometry.locaction.lng());


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
