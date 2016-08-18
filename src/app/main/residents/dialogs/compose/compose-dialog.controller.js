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

        // Data
        vm.residentList = resList;
        vm.form = {};
        vm.form.movedFrom = "Denver, CO, USA";

        var userid = authentication.currentUser().id;

        vm.autocompleteOptions = {
          componentRestrictions: { country: 'us' }
        }

        apilaData.userCommunity(userid)
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

          setLocationData();

          apilaData.addResident(vm.form)
          .success(function(response) {
                vm.residentList.push(response);
                $mdDialog.hide();
          })
          .error(function(response) {
            console.log("Error while adding resident");
          });
        }


        function setLocationData() {
          vm.form.movedFrom = {};
          vm.form.movedFrom.name = vm.form.locationInfo.formatted_address;
          vm.form.movedFrom.latitude = vm.form.locationInfo.geometry.location.lat();
          vm.form.movedFrom.longitude = vm.form.locationInfo.geometry.location.lng();
        }
    }
})();
