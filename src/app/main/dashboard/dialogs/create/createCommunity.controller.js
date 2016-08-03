(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('CreateCommunityController', CreateCommunityController);

    /** @ngInject */
    function CreateCommunityController($mdDialog, apilaData, authentication, $mdToast) {

      var vm = this;

      //Functions
      vm.closeDialog = closeDialog;
      vm.addCommunity = addCommunity;
      vm.recoverCommunity = recoverCommunity;

      // Data
      vm.form = {};

      vm.hasCanceledCommunity = false;

      vm.username = authentication.currentUser().name;
      vm.userid = authentication.currentUser().id;

      vm.restoreCommunity = false;

      apilaData.hasCanceledCommunity(vm.userid)
      .success(function(response) {
        vm.canceledCommunity = response;
        vm.hasCanceledCommunity = true;
      })
      .error(function(response) {
      });

      function closeDialog()
      {
          $mdDialog.hide();
      }


      function showErrorToast(errorMsg) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(errorMsg)
            .position("top right")
            .hideDelay(3000)
        );
      }

      function addCommunity()
      {
        vm.form.communityMembers = [];
        vm.form.pendingMembers = [];

        vm.form.username = vm.username;

        console.log(vm.cardInfo);
        console.log(vm.userid);

        if(!vm.form.name) {
          vm.nameError = "Community name must be specified";
          return;
        }

        Stripe.card.createToken(vm.cardInfo,
          function(status, response) {

            console.log(response);

            if(status !== 200) {
            //  showErrorToast(response.error.message);
              processErrors(response.error);
            } else {
              apilaData.saveCreditCard(vm.userid, response)
              .success(function(response) {
                console.log(response);

                apilaData.addCommunity(vm.form)
                .success(function(d) {
                  closeDialog();

                  $mdToast.show(
                    $mdToast.simple()
                      .textContent("Community has been created!")
                      .position("top right")
                      .hideDelay(2200)
                  );
                })
                .error(function(d) {
                  console.log("Error while creating community");
                });
              })
              .error(function(response) {
                console.log(response);
              });
            }


          });

      }


      function processErrors(error) {
        if(error.param === "card[number]") {
          vm.cardNumberError = "Invalid credit card number";
        } else if(error.param === "card[exp_month]") {
          vm.expMonthError = "Invalid Expiration Month entered please select between 01 - 12";
        } else if(error.param === "card[exp_year]") {
          vm.expYearError = "Invalid Expiration Year entered";
        }

      }

      function recoverCommunity() {
        Stripe.card.createToken(vm.cardInfo,
          function(status, response) {

            console.log(response);

            if(status !== 200) {
              //showErrorToast(response.error.message);
              processErrors(response.error);
            } else {
              apilaData.saveCreditCard(vm.userid, response)
              .success(function(response) {
                console.log(response);

                //restore community
                apilaData.restoreCommunity(vm.userid, vm.canceledCommunity._id)
                .success(function(response) {
                  console.log(response);

                  closeDialog();

                  $mdToast.show(
                    $mdToast.simple()
                      .textContent("Community has been restored!")
                      .position("top right")
                      .hideDelay(2200)
                  );

                })
                .error(function(response) {
                  console.log(response);
                });
              })
              .error(function(response) {

              });
            }

          });
      }




  }

})();
