(function ()
{
    'use strict';

    angular
        .module('app.residents')
        .controller('MailController', MailController);

    /** @ngInject */
    function MailController($scope, $document, $timeout, $mdDialog, $mdMedia,
                  $mdSidenav, apilaData, authentication, exportPdf)
    {
        var vm = this;

        // Data

        vm.lineChart = {
          options: {
              title:{
                text: "Simple Date-Time Chart"
            },
            axisX:{
                title: "timeline",
                gridThickness: 2
            },
            axisY: {
                title: "Downloads"
            }},
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          series: ['Temperature', 'Date'],
          data  : [
              [65, 59],
              [new Date(2012, 1, 1), new Date(2012, 1, 3)]
          ]
      };


        vm.checked = [];
        vm.colors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg'];
        vm.selectedAccount = 'creapond';
        vm.selectedResident = null;
        vm.toggleSidenav = toggleSidenav;

        vm.responsiveReadPane = undefined;
        vm.activeMailPaneIndex = 0;
        vm.dynamicHeight = false;

        vm.scrollPos = 0;
        vm.scrollEl = angular.element('#content');

        vm.selectedMailShowDetails = false;

        vm.categoryList = ["Administrative",
                           "Allergy",
                           "Bathing",
                           "Continent",
                           "Mobility",
                           "Nutrition",
                           "Pain",
                           "Physical condition",
                           "Psychosocial",
                           "Sleep",
                           "Vitals"];

        // Methods
        vm.checkAll = checkAll;
        vm.closeReadPane = closeReadPane;
        vm.composeDialog = composeDialog;
        vm.isChecked = isChecked;
        vm.replyDialog = replyDialog;
        vm.selectResident = selectResident;
        vm.toggleStarred = toggleStarred;
        vm.toggleCheck = toggleCheck;
        vm.updateResident = updateResident;
        vm.exportCarePlan = exportCarePlan;

        vm.selectedCategory = "Administrative";

        vm.switchCategory = function(category) {
          vm.selectedCategory = category;
        }


      apilaData.userCommunity(authentication.currentUser().name)
      .success(function(d) {
          vm.community = d;
          residentList(vm.community._id);
        });


        function residentList(id){
          //loading the list of residents
          apilaData.residentsList(id)
          .success(function(d) {
              vm.residentList = d;
              })
              .error(function(d) {
                console.log("Error retriving the list of residents");
            });
        }


        //////////

        // Watch screen size to activate responsive read pane
        $scope.$watch(function ()
        {
            return $mdMedia('gt-md');
        }, function (current)
        {
            vm.responsiveReadPane = !current;
        });

        // Watch screen size to activate dynamic height on tabs
        $scope.$watch(function ()
        {
            return $mdMedia('xs');
        }, function (current)
        {
            vm.dynamicHeight = current;
        });

        /**
         * Select resident
         *
         * @param resident
         */
        function selectResident(resident)
        {
            console.log(resident);

            vm.selectedResident = resident;

            $timeout(function ()
            {
                // If responsive read pane is
                // active, navigate to it
                if ( angular.isDefined(vm.responsiveReadPane) && vm.responsiveReadPane )
                {
                    vm.activeMailPaneIndex = 1;
                }

                // Store the current scrollPos
                vm.scrollPos = vm.scrollEl.scrollTop();

                // Scroll to the top
                vm.scrollEl.scrollTop(0);
            });
        }

        function exportCarePlan()
        {
          var canvas = angular.element("#linecanvas")[0];

          var carePlanData = {};
          carePlanData.firstName = vm.selectedResident.firstName;
          carePlanData.lastName = vm.selectedResident.lastName;
          carePlanData.temperature = canvas.toDataURL();
          carePlanData.communityName = vm.community.name;

          exportPdf.exportCarePlan(carePlanData);
        }

        function toGraphData(time, data)
        {
          var values = [];
          var graphData = [{"color":"#a215af"}];

          for(var i = 0; i < time.length; ++i) {
            values.push({"x" : time[i], "y" : data[i]});
          }

          graphData[0].values = values;

          console.log(graphData);

          return graphData;
        }

        /**
         * Close read pane
         */
        function closeReadPane()
        {
            if ( angular.isDefined(vm.responsiveReadPane) && vm.responsiveReadPane )
            {
                vm.activeMailPaneIndex = 0;

                $timeout(function ()
                {
                    vm.scrollEl.scrollTop(vm.scrollPos);
                }, 650);
            }
        }

        /**
         * Toggle starred
         *
         * @param mail
         * @param event
         */
        function toggleStarred(mail, event)
        {
            event.stopPropagation();
            mail.starred = !mail.starred;
        }

        /**
         * Toggle checked status of the mail
         *
         * @param mail
         * @param event
         */
        function toggleCheck(mail, event)
        {
            if ( event )
            {
                event.stopPropagation();
            }

            var idx = vm.checked.indexOf(mail);

            if ( idx > -1 )
            {
                vm.checked.splice(idx, 1);
            }
            else
            {
                vm.checked.push(mail);
            }
        }

        /**
         * Return checked status of the mail
         *
         * @param mail
         * @returns {boolean}
         */
        function isChecked(mail)
        {
            return vm.checked.indexOf(mail) > -1;
        }

        /**
         * Check all
         */
        function checkAll()
        {
            if ( vm.allChecked )
            {
                vm.checked = [];
                vm.allChecked = false;
            }
            else
            {
                angular.forEach(vm.inbox, function (mail)
                {
                    if ( !isChecked(mail) )
                    {
                        toggleCheck(mail);
                    }
                });

                vm.allChecked = true;
            }
        }

        /**
         * Open compose dialog
         *
         * @param ev
         */
        function composeDialog(ev)
        {
            $mdDialog.show({
                controller         : 'ComposeDialogController',
                controllerAs       : 'vm',
                locals             : {
                    resList        : vm.residentList
                },
                templateUrl        : 'app/main/residents/dialogs/compose/compose-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : ev,
                clickOutsideToClose: true
            });
        }

        /**
         * Open reply dialog
         *
         * @param ev
         */
        function replyDialog(ev)
        {
            $mdDialog.show({
                controller         : 'ComposeDialogController',
                controllerAs       : 'vm',
                locals             : {
                    selectedResident: vm.selectedResident
                },
                templateUrl        : 'app/main/residents/dialogs/compose/compose-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : ev,
                clickOutsideToClose: true
            });
        }


        function updateResident(ev)
        {
          //switch form based on category selected
          var cat = vm.selectedCategory;

          if(vm.selectedCategory === "Physical condition") {
            cat = "PhysicalCondition";
          }

          var templateUrl = 'app/main/residents/dialogs/update/update-'
                             + cat + '.html';

            $mdDialog.show({
                controller         : 'UpdateController',
                controllerAs       : 'vm',
                locals             : {
                  currAppointment: ev
                },
                templateUrl        : templateUrl,
                parent             : angular.element($document.body),
                targetEvent        : ev,
                clickOutsideToClose: true
            });
        }

        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }
    }
})();
