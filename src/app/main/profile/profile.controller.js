(function ()
{
    'use strict';

    angular
        .module('app.profile')
        .controller('ProfileController', ProfileController);

    /** @ngInject */
    function ProfileController(authentication, apilaData, Upload, $mdToast, $timeout, $mdDialog, $document, $window)
    {
        var vm = this;

        vm.searchText = "";

        // Data
        vm.username = authentication.currentUser().name;
        vm.userid = authentication.currentUser().id;
        vm.hasCommunity = false;

        // Methods
        vm.sendRequest = sendRequest;
        vm.uploadFiles = uploadFiles;
        vm.openCommunityModal = openCommunityModal;
        vm.changeUsername = changeUsername;

        //Autofield selectbox setup
        vm.residentList = [];
        vm.selectedCommunity = {};
        vm.formatedRegister = "";

        vm.userImage = authentication.getUserImage();

        apilaData.getUser(vm.userid)
        .success(function(response) {
          vm.currUser = response;

          vm.formatedRegister = moment(vm.currUser.registeredOn).format('LL');
        })
        .error(function(response) {
          console.log(response);
        });

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
              return vm.residentList;
            }
            var textLower = text.toLowerCase();

              var ret = vm.residentList.filter(function (d) {
                  if(d.display != null)
                  return d.display.toLowerCase().indexOf(text) > -1;
              });
              return ret;
          };

        apilaData.userCommunity(vm.userid)
          .success(function(d) {
            vm.myCommunity = d;
            vm.hasCommunity = true;
          })
          .error(function(d) {
          });


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
          })
          .error(function(d) {

          });
        }

        function changeUsername() {

          apilaData.changeUsername(vm.userid, vm.form)
          .success(function(response) {
            console.log(response);
            vm.userExists = "";
            authentication.changeUsername(vm.form.username);
            $window.location.reload();
          })
          .error(function(response) {
            console.log(response);
            vm.userExists = response.message;
          });
        }


        function openCommunityModal(ev) {
          $mdDialog.show({
              controller         : 'CreateCommunityController',
              controllerAs       : 'vm',
              templateUrl        : 'app/main/dashboard/dialogs/create/createCommunity.html',
              parent             : angular.element($document.body),
              targetEvent        : ev,
              clickOutsideToClose: true
          });
        }

        function uploadFiles(file, errFiles) {

          var uploadUrl = apilaData.getApiUrl() + '/api/users/'+ vm.userid + '/upload';

          if (file) {
              file.upload = Upload.upload({
                  url: uploadUrl,
                  data: {file: file},
                  headers: {
                      Authorization: 'Bearer ' + authentication.getToken()
                  }
              });

              file.upload.then(function (response) {
                  $timeout(function () {
                      file.result = response.data;

                      authentication.setUserImage(response.data);
                      vm.userImage = response.data;

                      $mdToast.show(
                        $mdToast.simple()
                          .textContent("User profile image updated!")
                          .position("top right")
                          .hideDelay(1000)
                      );

                  });

              });
          }
        }

        //////////
    }

})();
