(function() {
  'use strict';

  angular
    .module('app.residents')
    .controller('MailController', MailController);

  /** @ngInject */
  function MailController($scope, $document, $timeout, $mdDialog, $mdMedia,
    $mdSidenav, $mdToast, apilaData, authentication, exportPdf) {
    var vm = this;

    // Data
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

    vm.categoryList = [
      "Administrative",
      "Allergy",
      "Bathing",
      "Continent",
      "Mobility",
      "Nutrition",
      "Pain",
      "Physical condition",
      "Psychosocial",
      "Sleep",
      "Vitals"
    ];

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


    function residentList(id) {
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
     * Select resident
     *
     * @param resident
     */
    function selectResident(resident) {
      vm.selectedResident = resident;

      drawGraphs(vm.selectedResident);

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

    }

    function exportCarePlan() {

      if (vm.selectedResident === null) {
        $mdToast.show(
          $mdToast.simple()
          .textContent("Please selecte a resident to export a care plan")
          .position("top right")
          .hideDelay(2000)
        );
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

        var carePlanData = {};

        // vitals graphing
        carePlanData.temperature = tempCanvas.toDataURL();
        carePlanData.bloodCanvas = bloodCanvas.toDataURL();
        carePlanData.oxygen = oxygenCanvas.toDataURL();
        carePlanData.pulse = pulseCanvas.toDataURL();
        carePlanData.vitals = vitalsCanvas.toDataURL();
        carePlanData.resp = respCanvas.toDataURL();

        // admin
        carePlanData.firstName = vm.selectedResident.firstName;
        carePlanData.middleName = vm.selectedResident.middleName;
        carePlanData.lastName = vm.selectedResident.lastName;
        carePlanData.maidenName = vm.selectedResident.maidenName;
        carePlanData.birthDate = vm.selectedResident.birthDate;
        carePlanData.admissionDate = vm.selectedResident.admissionDate;
        carePlanData.sex = vm.selectedResident.sex;
        carePlanData.buildingStatus = vm.selectedResident.buildingStatus;
        carePlanData.movedOutDescribe = vm.selectedResident.movedOutDescribe;
        carePlanData.movedOutTo = vm.selectedResident.movedOutTo;

        // Bathing
        carePlanData.typeOfBathing = vm.selectedResident.typeOfBathing;
        carePlanData.timeOfBathing = vm.selectedResident.timeOfBathing;
        carePlanData.frequencyOfBathing = vm.selectedResident.frequencyOfBathing;
        carePlanData.acceptanceOfBathing = vm.selectedResident.acceptanceOfBathing;
        carePlanData.dislikesBathingDescribe = vm.selectedResident.dislikesBathingDescribe;

        // Mobility - throws an error because nesting
        carePlanData.insideApartment = {};
        carePlanData.outsideApartment = {};

        carePlanData.insideApartment.useOfAssistiveDevice = vm.selectedResident.insideApartment.useOfAssistiveDevice;
        carePlanData.insideApartment.assitanceWithDevice = vm.selectedResident.insideApartment.assitanceWithDevice;
        carePlanData.insideApartment.specialAmbulationNeeds = vm.selectedResident.insideApartment.specialAmbulationNeeds;

        carePlanData.outsideApartment.useOfAssistiveDevice = vm.selectedResident.outsideApartment.useOfAssistiveDevice;
        carePlanData.outsideApartment.assitanceWithDevice = vm.selectedResident.outsideApartment.assitanceWithDevice;
        carePlanData.outsideApartment.specialAmbulationNeeds = vm.selectedResident.outsideApartment.specialAmbulationNeeds;

        carePlanData.transfers = vm.selectedResident.transfers;
        carePlanData.fallRisk = vm.selectedResident.fallRisk;
        carePlanData.fallRiskDescribe = vm.selectedResident.fallRiskDescribe;
        carePlanData.bedReposition = vm.selectedResident.bedReposition;

        // Allergy
        carePlanData.hasFoodAllergies = vm.selectedResident.hasFoodAllergies;
        carePlanData.foodAllergies = vm.selectedResident.foodAllergies;
        carePlanData.hasMedicationAllergies = vm.selectedResident.hasMedicationAllergies;
        carePlanData.medicationAllergies = vm.selectedResident.medicationAllergies;

        // sleep
        carePlanData.usualBedtime = vm.selectedResident.usualBedtime;
        carePlanData.usualArisingTime = vm.selectedResident.usualArisingTime;
        carePlanData.nap = vm.selectedResident.nap;
        carePlanData.napDescribe = vm.selectedResident.napDescribe;
        carePlanData.assistanceToBed = vm.selectedResident.assistanceToBed;
        carePlanData.sleepsThroughNight = vm.selectedResident.sleepsThroughNight;
        carePlanData.canCallForAssistance = vm.selectedResident.canCallForAssistance;

        // Continent
        carePlanData.bowelContinent = vm.selectedResident.bowelContinent;
        carePlanData.constipated = vm.selectedResident.constipated;
        carePlanData.laxative = vm.selectedResident.laxative;
        carePlanData.bladderContinent = vm.selectedResident.bladderContinent;
        carePlanData.dribbles = vm.selectedResident.dribbles;
        carePlanData.catheter = vm.selectedResident.catheter;
        carePlanData.catheterDescribe = vm.selectedResident.catheterDescribe;
        carePlanData.toiletingDevice = vm.selectedResident.toiletingDevice;

        // Nutrition
        carePlanData.overallNutrition = vm.selectedResident.overallNutrition;
        carePlanData.poorNutritionDescribe = vm.selectedResident.poorNutritionDescribe;
        carePlanData.diabetic = vm.selectedResident.diabetic;
        carePlanData.diabeticType = vm.selectedResident.diabeticType;
        carePlanData.bloodSugarMonitoring = vm.selectedResident.bloodSugarMonitoring;
        carePlanData.bedtimeSnack = vm.selectedResident.bedtimeSnack;
        carePlanData.adaptiveEquipment = vm.selectedResident.adaptiveEquipment;
        carePlanData.needsFoodInSmallPeices = vm.selectedResident.needsFoodInSmallPeices;
        carePlanData.typeOfDiet = vm.selectedResident.typeOfDiet;
        carePlanData.foodLikes = vm.selectedResident.foodLikes;
        carePlanData.foodDislikes = vm.selectedResident.foodDislikes;
        carePlanData.fingerFoods = vm.selectedResident.fingerFoods;

        // physical condition information
        carePlanData.skinCondition = vm.selectedResident.skinCondition;
        carePlanData.hasWound = vm.selectedResident.hasWound;
        carePlanData.hasWoundDescribe = vm.selectedResident.hasWoundDescribe;
        carePlanData.woundAmount = vm.selectedResident.woundAmount;
        carePlanData.rightEar = vm.selectedResident.rightEar;
        carePlanData.leftEar = vm.selectedResident.leftEar;
        carePlanData.hearingNotes = vm.selectedResident.hearingNotes;
        carePlanData.wearsHearingAid = vm.selectedResident.wearsHearingAid;
        carePlanData.helpWithHearingAid = vm.selectedResident.helpWithHearingAid;
        carePlanData.helpWithHearingAidDescribe = vm.selectedResident.helpWithHearingAidDescribe;
        carePlanData.rightEye = vm.selectedResident.rightEye;
        carePlanData.leftEye = vm.selectedResident.leftEye;
        carePlanData.visionNotes = vm.selectedResident.visionNotes;
        carePlanData.dentistName = vm.selectedResident.dentistName;
        carePlanData.upperDentureFit = vm.selectedResident.upperDentureFit;
        carePlanData.upperDentureFitDescribe = vm.selectedResident.upperDentureFitDescribe;
        carePlanData.upperTeeth = vm.selectedResident.upperTeeth;
        carePlanData.lowerDentureFit = vm.selectedResident.lowerDentureFit;
        carePlanData.lowerDentureFitDescribe = vm.selectedResident.lowerDentureFitDescribe;
        carePlanData.lowerTeeth = vm.selectedResident.lowerTeeth;
        carePlanData.teethCondition = vm.selectedResident.teethCondition;

        // psychosocial
        carePlanData.psychosocialStatus = vm.selectedResident.psychosocialStatus;
        carePlanData.psychosocialStatusDescribe = vm.selectedResident.psychosocialStatusDescribe;
        carePlanData.comprehension = vm.selectedResident.comprehension;
        carePlanData.smokes = vm.selectedResident.smokes;
        carePlanData.smokesDescribe = vm.selectedResident.smokesDescribe;
        carePlanData.alcohol = vm.selectedResident.alcohol;
        carePlanData.alcoholDescribes = vm.selectedResident.alcoholDescribes;
        carePlanData.sexualActive = vm.selectedResident.sexualActive;
        carePlanData.sexualActiveDescribe = vm.selectedResident.sexualActiveDescribe;
        carePlanData.otherHabits = vm.selectedResident.otherHabits;
        carePlanData.generalActivityParticipation = vm.selectedResident.generalActivityParticipation;
        carePlanData.diningRoomParticipation = vm.selectedResident.diningRoomParticipation;
        carePlanData.busRideParticipation = vm.selectedResident.busRideParticipation;
        carePlanData.fitnessClassParticipation = vm.selectedResident.fitnessClassParticipation;
        carePlanData.bingoParticipation = vm.selectedResident.bingoParticipation;
        carePlanData.communityParticipation = vm.selectedResident.communityParticipation;
        carePlanData.timeInRoom = vm.selectedResident.timeInRoom;
        carePlanData.drivesCar = vm.selectedResident.drivesCar;
        carePlanData.licensePlateNumber = vm.selectedResident.licensePlateNumber;
        carePlanData.spareKeyLocation = vm.selectedResident.spareKeyLocation;
        carePlanData.drivingNeeds = vm.selectedResident.drivingNeeds;
        carePlanData.preferedActivites = vm.selectedResident.preferedActivites;
        carePlanData.useFitnessEquipmentIndependently = vm.selectedResident.useFitnessEquipmentIndependently;
        carePlanData.familyInvolvement = vm.selectedResident.familyInvolvement;
        carePlanData.highMaintenance = vm.selectedResident.highMaintenance;

        // pain
        carePlanData.hasPain = vm.selectedResident.hasPain;
        carePlanData.painLocation = vm.selectedResident.painLocation;
        carePlanData.painDescription = vm.selectedResident.painDescription;
        carePlanData.maxPainTime = vm.selectedResident.maxPainTime;
        carePlanData.painIncreasedBy = vm.selectedResident.painIncreasedBy;
        carePlanData.painDecreasedBy = vm.selectedResident.painDecreasedBy;
        carePlanData.painManagedBy = vm.selectedResident.painManagedBy;
        carePlanData.painLength = vm.selectedResident.painLength;


        carePlanData.communityName = vm.community.name;

        exportPdf.exportCarePlan(carePlanData);
      }, 500);
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

    /**
     * Toggle checked status of the mail
     *
     * @param mail
     * @param event
     */
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

    /**
     * Open compose dialog
     *
     * @param ev
     */
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

    /**
     * Open reply dialog
     *
     * @param ev
     */
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
          currAppointment: ev
        },
        templateUrl: templateUrl,
        parent: angular.element($document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      });
    }

    /**
     * Toggle sidenav
     *
     * @param sidenavId
     */
    function toggleSidenav(sidenavId) {
      $mdSidenav(sidenavId).toggle();
    }
  }
})();
