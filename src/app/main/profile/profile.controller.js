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

        // Data
        vm.username = authentication.currentUser().name;

        // Methods


        //Autofield selectbox setup
        vm.residentList = [];
        vm.selectedUser = {};

        apilaData.residentsList()
          .success(function(residentList) {
            //console.log(residentList);
            vm.residentList = residentList.map(function(elem) {
              return {value: elem._id, display: elem.firstName + " " + elem.lastName};
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

        //////////
    }

})();
