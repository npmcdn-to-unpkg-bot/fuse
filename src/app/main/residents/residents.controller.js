(function() {
  'use strict';

  angular
    .module('app.residents')
    .controller('MailController', MailController);

  /** @ngInject */
  function MailController($scope, $document, $timeout, $mdDialog, $mdMedia,
    $mdSidenav, $mdToast, apilaData, authentication, exportCarePlan, exportResidentCensus, exportFaceSheet, exportBlankCarePlan, uiGmapGoogleMapApi, ResidentUpdateInfoService) {
    var vm = this;


    // Data
    vm.checked = [];
    vm.updateInfoList = [];
    vm.colors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg'];
    vm.selectedAccount = 'creapond';
    vm.selectedResident = null;
    vm.toggleSidenav = toggleSidenav;

    vm.responsiveReadPane = undefined;
    vm.activeMailPaneIndex = 0;
    vm.dynamicHeight = false;

    vm.selectedCategory = "Administrative";

    vm.latitude = 40.77627;
    vm.longitude = -73.910964;

    vm.scrollPos = 0;
    vm.scrollEl = angular.element('#content');

    vm.selectedMailShowDetails = false;

    vm.userid = authentication.currentUser().id;

    vm.categoryList = [
      "Administrative",
      "Allergy",
      "Bathing",
      "Continent",
      "Life",
      "Mobility",
      "Nutrition",
      "Pain",
      "Physical condition",
      "Psychosocial",
      "Sleep",
      "Vitals",
      "Activity"
    ];

    // Methods
    vm.selectResident = selectResident;
    vm.updateResident = updateResident;
    vm.exportCarePlan = exportResident;
    vm.exportCensus = exportCensus;
    vm.exportResidentFaceSheet = exportResidentFaceSheet;
    vm.exportBlankPlan = exportBlankPlan;
    vm.replyDialog = replyDialog;
    vm.composeDialog = composeDialog;

    vm.checkAll = checkAll;
    vm.closeReadPane = closeReadPane;
    vm.isChecked = isChecked;
    vm.toggleStarred = toggleStarred;
    vm.toggleCheck = toggleCheck;
    vm.mapComprehension = mapComprehension;

    vm.switchCategory = function(category) {
      vm.selectedCategory = category;
    };


    //// INITIAL LOADING  ////
    apilaData.userCommunity(vm.userid)
      .success(function(d) {
        vm.community = d;
        residentList(vm.community._id);
      });

    //loading the list of residents
    function residentList(id) {
      apilaData.residentsList(id)
        .success(function(d) {
          vm.residentList = d;
        })
        .error(function(d) {
          console.log("Error retriving the list of residents");
        });
    }


    function selectResident(resident) {
      vm.selectedResident = resident;

      drawGraphs(vm.selectedResident);

      vm.updateInfoList = ResidentUpdateInfoService.formatUpdateArray(vm.selectedResident.updateInfo);

      if (vm.selectedResident.movedFrom) {
        vm.latitude = vm.selectedResident.movedFrom.latitude;
        vm.longitude = vm.selectedResident.movedFrom.longitude;
      }

      vm.movedFromMap = {
        center: {
          latitude: vm.latitude,
          longitude: vm.longitude
        },
        zoom: 8,
        marker: {
          id: 0,
          coords: {
            latitude: vm.latitude,
            longitude: vm.longitude
          }
        }
      };


      $timeout(function() {
        // If responsive read pane is
        // active, navigate to it
        if (angular.isDefined(vm.responsiveReadPane) && vm.responsiveReadPane) {
          vm.activeMailPaneIndex = 1;
        }

        // Store the current scrollPos
        vm.scrollPos = vm.scrollEl.scrollTop();

        // Scroll to the top
        vm.scrollEl.scrollTop(0);
      });
    }

    function selectedResidentToast() {
      if (vm.selectedResident === null) {
        $mdToast.show(
          $mdToast.simple()
          .textContent("Please select a resident to export a care plan")
          .position("top right")
          .hideDelay(2000)
        );
        return false;
      } else {
        return true;
      }
    }

    function exportResident() {

      if(!selectedResidentToast()){
        return;
      }

      vm.selectedCategory = "Vitals";

      $timeout(function() {
        var tempCanvas = angular.element("#temperaturecanvas")[0];
        var bloodCanvas = angular.element("#bloodPressureCanvas")[0];
        var oxygenCanvas = angular.element("#oxygenSaturationCanvas")[0];
        var pulseCanvas = angular.element("#plusCanvas")[0];
        var vitalsCanvas = angular.element("#vitalsPainCanvas")[0];
        var respCanvas = angular.element("#respirationCanvas")[0];
        //var weightCanvas = angular.element("#weightCanvas")[0];

        var carePlanData = {};

        // setting all the properties from selectedResident to carePlanData to export
        for (var prop in vm.selectedResident) {
          if (vm.selectedResident.hasOwnProperty(prop)) {
            carePlanData[prop] = vm.selectedResident[prop];
          }
        }

        // vitals graphing
        carePlanData.temperature = tempCanvas.toDataURL();
        carePlanData.bloodCanvas = bloodCanvas.toDataURL();
        carePlanData.oxygen = oxygenCanvas.toDataURL();
        carePlanData.pulse = pulseCanvas.toDataURL();
        carePlanData.vitals = vitalsCanvas.toDataURL();
        carePlanData.resp = respCanvas.toDataURL();
        //carePlanData.weight = weightCanvas.toDataURL();

        // community
        carePlanData.communityName = vm.community.name;

        exportCarePlan.exportPdf(carePlanData);
      }, 500);
    }

    function exportCensus() {

      var inBuildingResidents = _.filter(vm.residentList, ['buildingStatus', 'In Building']);

      exportResidentCensus.exportPdf(inBuildingResidents);
    }

    function exportResidentFaceSheet() {

      if(!selectedResidentToast()){
        return;
      }

      exportFaceSheet.exportPdf(vm.selectedResident);
    }

    function exportBlankPlan() {
      if(!selectedResidentToast()){
        return;
      }

      exportBlankCarePlan.exportPdf(vm.selectedResident);
    }

    function updateResident(ev) {
      //switch form based on category selected
      var cat = vm.selectedCategory;

      if (vm.selectedCategory === "Physical condition") {
        cat = "PhysicalCondition";
      }

      var templateUrl = 'app/main/residents/dialogs/update/update-' +
        cat + '.html';

      $mdDialog.show({
          controller: 'UpdateController',
          controllerAs: 'vm',
          locals: {
            currResident: ev
          },
          templateUrl: templateUrl,
          parent: angular.element($document.body),
          targetEvent: ev,
          clickOutsideToClose: true
        })
        .then(function() {
          vm.updateInfoList = ResidentUpdateInfoService.formatUpdateArray(vm.selectedResident.updateInfo);
        });

    }

    /////////////////////////////////////////////////////////////////
    //// DIALOGS ////

    function composeDialog(ev) {
      $mdDialog.show({
        controller: 'ComposeDialogController',
        controllerAs: 'vm',
        locals: {
          resList: vm.residentList
        },
        templateUrl: 'app/main/residents/dialogs/compose/compose-dialog.html',
        parent: angular.element($document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      });
    }

    function replyDialog(ev) {
      $mdDialog.show({
        controller: 'ComposeDialogController',
        controllerAs: 'vm',
        locals: {
          selectedResident: vm.selectedResident
        },
        templateUrl: 'app/main/residents/dialogs/compose/compose-dialog.html',
        parent: angular.element($document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      });
    }

    /////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////
    //// HELPER FUNCTIONS ////

    function createGraphData(vitalType, name) {
      var dataValues = _.map(vitalType, "data")
      var timeFrame = _.map(vitalType, function(d) {
        return moment(d.date).format("MMM Do YY");
      });

      var chartData = {
        labels: timeFrame,
        series: [name],
        data: [dataValues]
      };

      return chartData;

    }


    function drawGraphs(resident) {

      vm.vitalsCharts = [];

      var bloodDiasValues = _.map(resident.bloodPressureDiastolic, "data")
      var timeFrame = _.map(resident.bloodPressureDiastolic, function(d) {
        return moment(d.date).format("MMM Do YY");
      });

      var bloodSysValues = _.map(resident.bloodPressureSystolic, "data")

      vm.bloodPresureChart = {
        labels: timeFrame,
        series: ['Blood Pressure Diastolic', 'Blood Pressure Systolic'],
        data: [
          bloodDiasValues, bloodSysValues
        ]
      };

      vm.vitalsCharts.push(createGraphData(resident.temperature, 'Temperature'));
      vm.vitalsCharts.push(vm.bloodPresureChart);
      vm.vitalsCharts.push(createGraphData(resident.bloodPressureDiastolic, 'Blood Pressure Diastolic'));
      vm.vitalsCharts.push(createGraphData(resident.oxygenSaturation, 'Oxygen Saturation'));
      vm.vitalsCharts.push(createGraphData(resident.pulse, 'Pulse'));
      vm.vitalsCharts.push(createGraphData(resident.vitalsPain, 'Vitals Pain'));
      vm.vitalsCharts.push(createGraphData(resident.respiration, 'Respiration'));
      vm.vitalsCharts.push(createGraphData(resident.weight, 'Weight'));

    }

    ///////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////
    //// FUSE UI FUNCTIONS ////

    // Watch screen size to activate responsive read pane
    $scope.$watch(function() {
      return $mdMedia('gt-md');
    }, function(current) {
      vm.responsiveReadPane = !current;
    });

    // Watch screen size to activate dynamic height on tabs
    $scope.$watch(function() {
      return $mdMedia('xs');
    }, function(current) {
      vm.dynamicHeight = current;
    });

    /**
     * Toggle sidenav
     *
     * @param sidenavId
     */
    function toggleSidenav(sidenavId) {
      $mdSidenav(sidenavId).toggle();
    }


    /**
     * Close read pane
     */
    function closeReadPane() {
      if (angular.isDefined(vm.responsiveReadPane) && vm.responsiveReadPane) {
        vm.activeMailPaneIndex = 0;

        $timeout(function() {
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
    function toggleStarred(mail, event) {
      event.stopPropagation();
      mail.starred = !mail.starred;
    }

    function mapComprehension(numValue) {
      switch(numValue) {
        case 0: {
          return "Slow";
        }
        case 1: {
          return "Moderate";
        }
        case 2: {
          return "Quick";
        }
        default: {
          return "Slow";
        }
      }
    }

    function toggleCheck(mail, event) {
      if (event) {
        event.stopPropagation();
      }

      var idx = vm.checked.indexOf(mail);

      if (idx > -1) {
        vm.checked.splice(idx, 1);
      } else {
        vm.checked.push(mail);
      }
    }

    /**
     * Return checked status of the mail
     *
     * @param mail
     * @returns {boolean}
     */
    function isChecked(mail) {
      return vm.checked.indexOf(mail) > -1;
    }


    /**
     * Check all
     */
    function checkAll() {
      if (vm.allChecked) {
        vm.checked = [];
        vm.allChecked = false;
      } else {
        angular.forEach(vm.inbox, function(mail) {
          if (!isChecked(mail)) {
            toggleCheck(mail);
          }
        });

        vm.allChecked = true;
      }
    }
  }
})();
