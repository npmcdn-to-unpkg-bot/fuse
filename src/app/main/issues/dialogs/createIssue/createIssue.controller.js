(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .controller('CreateIssueController', CreateIssueController);

    /** @ngInject */
    function CreateIssueController($mdDialog, apilaData, board, name, authentication, msNavigationService) {

      var vm = this;

      // Data
      var username = authentication.currentUser().name;
      var userid = authentication.currentUser().id;
      vm.residentList = [];
      vm.selectedUser = {};

      //Functions
      vm.closeDialog = closeDialog;
      vm.addIssue = addIssue;

      console.log(name);

      // if (name != null) {
      //   vm.selectedItem = {
      //     value: userid,
      //     display: name
      //   };
      // }

      apilaData.userCommunity(userid)
      .success(function(d) {
        vm.myCommunity = d;
      });

      function closeDialog()
      {
          $mdDialog.hide();
      }

      vm.getMatches = function (text) {
        if(text === null) {
          return;
        }
        var textLower = text.toLowerCase();

          var ret = vm.residentList.filter(function (d) {
              if(d.display != null) {
                return d.display.toLowerCase().indexOf(text) > -1;
              }

          });
          return ret;
      };

     apilaData.usersList()
       .success(function(usersList) {
         vm.residentList = usersList.map(function(elem) {

           if (elem.name === name) {
             vm.selectedItem = {
               value: elem._id,
               display: elem.name
             };
           }

           return {
             value: elem._id,
             display: elem.name
           };
         });

         console.log(vm.residentList);
       })
       .error(function(usersList) {
         console.log("Error retriving the list of residents");
       });

      function addIssue() {

        vm.form.responsibleParty = vm.selectedItem.value;
        vm.form.community = vm.myCommunity;

        apilaData.addIssue(vm.form)
            .success(function(issue) {

              console.log(issue);

              issue.id = issue._id;
              issue.name = issue.title;

              if(board.data === undefined) {
                board.data = board;
              }

              board.data.cards.push(issue);

              var username = authentication.currentUser().name;

              apilaData.openIssuesCount(userid, vm.myCommunity._id)
                .success(function(count) {
                  msNavigationService.saveItem('fuse.issues', {
                    badge: {
                      content:  count,
                      color  : '#F44336'
                    }
                  });
                })
                .error(function(count) {
                });


              for(var i = 0; i < board.data.lists.length;++i) {
                if(board.data.lists[i].name === issue.responsibleParty.name) {
                  board.data.lists[i].idCards.push(issue.id);
                  break;
                }

              }


              closeDialog();
            })
            .error(function(issue) {
                console.log("Error while adding issue");
            });
      }

    }

})();
