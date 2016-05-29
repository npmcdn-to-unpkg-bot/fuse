(function ()
{
    'use strict';

    angular
        .module('app.profile')
        .controller('ProfileController', ProfileController);

    /** @ngInject */
    function ProfileController(authentication, apilaData)
    {
        var vm = this;

        vm.searchText = "";

        // Data
        vm.username = authentication.currentUser().name;

        // Methods
        vm.sendRequest = sendRequest;

        //Autofield selectbox setup
        vm.residentList = [];
        vm.selectedCommunity = {};

        apilaData.communityList()
          .success(function(residentList) {
            //console.log(residentList);
            vm.residentList = residentList.map(function(elem) {
              return {value: elem._id, display: elem.name};
            });
          })
          .error(function(residentList) {
            console.log("Error retriving the list of residents");
          });

          vm.getMatches = function (text) {
            if(text === null) {
              return;
            }
            var textLower = text.toLowerCase();

              var ret = vm.residentList.filter(function (d) {
                  if(d.display != null)
                  return d.display.toLowerCase().indexOf(text) > -1;
              });
              return ret;
          }

        apilaData.userCommunity(vm.username)
          .success(function(d) {
            vm.myCommunity = d;
          })
          .error(function(d) {
          });

        function sendRequest()
        {

          console.log(vm.selectedItem);
          vm.communityId = vm.selectedItem.value;

          var data = {};
          data.pendingMember = vm.username;

          apilaData.addPendingMember(data, vm.communityId)
          .success(function(d) {
            vm.searchText = "";
          })
          .error(function(d) {

          });
        }

        //////////
    }

})();
