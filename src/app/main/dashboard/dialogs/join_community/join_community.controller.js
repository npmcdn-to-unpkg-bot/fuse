(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('JoinCommunityController', JoinCommunityController);

    /** @ngInject */
    function JoinCommunityController($mdDialog, apilaData, $mdToast, authentication) {

      var vm = this;

      vm.searchText = "";

      // Data
      vm.username = authentication.currentUser().name;

      // Functions
      vm.closeDialog = closeDialog;
      vm.sendRequest = sendRequest;

      apilaData.communityList()
        .success(function(communityList) {
          //console.log(communityList);
          vm.communityList = communityList.map(function(elem) {
            return {value: elem._id, display: elem.name};
          });
        })
        .error(function(communityList) {
          console.log("Error retriving the list of residents");
        });


        vm.getMatches = function (text) {
          if(text === null) {
            return vm.communityList;
          }
          var textLower = text.toLowerCase();

            var ret = vm.communityList.filter(function (d) {
                if(d.display != null)
                return d.display.toLowerCase().indexOf(text) > -1;
            });
            return ret;
        }

      function closeDialog()
      {
          $mdDialog.hide();
      }

      function sendRequest()
      {

        if(vm.selectedItem === null) {
          return;
        }

        $mdToast.show(
          $mdToast.simple()
            .textContent('Invite Request Sent to ' + vm.selectedItem.display)
            .position("top right")
            .hideDelay(3000)
        );

        vm.communityId = vm.selectedItem.value;

        var data = {};
        data.pendingMember = vm.username;

        apilaData.addPendingMember(data, vm.communityId)
        .success(function(d) {
          vm.searchText = "";
          closeDialog();
        })
        .error(function(d) {
          closeDialog();
        });
      }


    }

  })();
