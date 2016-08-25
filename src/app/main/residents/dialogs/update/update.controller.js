(function() {
  'use strict'

  angular.module('app.residents')
    .controller('UpdateController', UpdateController);

  /** @ngInject */
  function UpdateController($mdDialog, $mdConstant, currResident, apilaData, authentication) {

    var vm = this;

    //filling in old data for the update
    vm.form = currResident;

    vm.status = [];
    vm.status.push({active: false, title:"Alert"});
    vm.status.push({active: false, title:"Friendly"});
    vm.status.push({active: false, title:"Disoriented"});
    vm.status.push({active: false, title:"Withdrawn"});
    vm.status.push({active: false, title:"Lonely"});
    vm.status.push({active: false, title:"Happy"});
    vm.status.push({active: false, title:"Confused"});
    vm.status.push({active: false, title:"Uncooperative"});

    vm.foodAllergies = currResident.foodAllergies;
    vm.medicationAllergies = currResident.medicationAllergies;

    vm.foodLikes = currResident.foodLikes;
    vm.foodDislikes = currResident.foodDislikes;

    //needed unchanged values to compare for updateField
    vm.copyResident = angular.copy(currResident);

    vm.seperators = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA];

    vm.autocompleteOptions = {
      componentRestrictions: { country: 'us' }
    };

    setSelectedStatuses(currResident.psychosocialStatus);

    vm.form.birthDate = new Date(currResident.birthDate);
    vm.form.admissionDate = new Date(currResident.admissionDate);
    vm.form.locationInfo = vm.form.movedFrom.name;

    //Functions
    vm.closeDialog = closeDialog;
    vm.updateResident = updateResident;
    vm.removeChip = removeChip;

    function closeDialog() {
      $mdDialog.hide();
    }

    //before sending to server set all the fields and format them correctly
    function formatData() {

      vm.form.modifiedBy = authentication.currentUser().name;
      vm.form.modifiedDate = new Date();

      var changedFields =
        checkChangedFields(vm.copyResident, vm.form);

      addToStatusArray();

      if(vm.form.locationInfo.geometry !== undefined) {
        vm.form.movedFrom.name = vm.form.locationInfo.formatted_address;
        vm.form.movedFrom.latitude = vm.form.locationInfo.geometry.location.lat();
        vm.form.movedFrom.longitude = vm.form.locationInfo.geometry.location.lng();
      }

      if (changedFields.length > 0) {
        vm.form.updateField = changedFields;
      }

    }


    function updateResident() {

      formatData();

      console.log(vm.form);

      vm.form.newfoodAllergies = vm.foodAllergies;
      vm.form.newmedicationAllergies = vm.medicationAllergies;

      vm.form.newfoodLikes = vm.foodLikes;
      vm.form.newfoodDislikes = vm.foodDislikes;

      apilaData.updateResident(currResident._id, vm.form)
        .success(function(resident) {

          currResident.updateInfo = resident.updateInfo;

          pushNewValues();
          resetFields();

          closeDialog();
        })
        .error(function(appoint) {
          console.log("Error while updating resident");
        });
      return false;
    }

    function addToStatusArray()
    {
      vm.form.newpsychosocialStatus = [];

      for(var i  = 0; i < vm.status.length; ++i)
      {
        if(vm.status[i].active == true) {
          vm.form.newpsychosocialStatus.push(vm.status[i].title);
        }

      }
    }

    function setSelectedStatuses(arr)
    {

      for(var i  = 0; i < vm.status.length; ++i)
      {
         var checkedElem = _.find(vm.status, function(d) {
            if(d.title == arr[i]){
              return d;
            }});

        if(checkedElem != undefined) {
          checkedElem.active = true;
        }
      }
    }

    function removeChip(list, type) {

      var data = {
        "list" : list,
        "type" : type
      };

      apilaData.removeListItem(vm.copyResident._id, data)
      .success(function(response) {
        console.log(response);
      })
      .error(function(response) {
        console.log(response);
      });
    }

    //checks what fields changed in the updates
    function checkChangedFields(oldData, newData) {

      var diff = [];
      var attributeArr = [

        // administrative
        "firstName",
        "aliasName",
        "lastName",
        "middleName",
        "maidenName",
        "sex",
        "buildingStatus",
        "administrativeNotes",

        // bathing
        "typeOfBathing",
        "timeOfBathing",
        "frequencyOfBathing",
        "acceptanceOfBathing",

        // continent
        "bowelContinent",
        "constipated",
        "laxative",
        "bladderContinent",
        "dribbles",
        "catheter",
        "toiletingDevice",
        "transfers",
        "fallRisk",
        "bedReposition",
        "overallNutrition",
        "poorNutritionIntervention",
        "diabetic",
        "diabeticType",
        "regularBloodSugarMonitoring",
        "bedtimeSnack",
        "adaptiveEquipment",
        "needsFoodInSmallPeices",
        "typeOfDiet",
        "havePain",
        "painLocation",
        "painDescription",
        "maxPainTime",
        "painIncreasedBy",
        "painDecreasedBy",
        "height",
        "skinCondition",
        "wearsHearingAid",
        "teethCondition",
        "psychosocialResponsiveness",
        "mood",
        "comprehension",
        "generalActivityParticipation",
        "diningRoomParticipation",
        "busRideParticipation",
        "fitnessClassParticipation",
        "timeInRoom",
        "preferedActivites",
        "useFitnessEquipmentIndependently",
        "familyInvolvement",
        "usualBedtime",
        "usualArisingTime",
        "nap",
        "assistanceToBed",
        "sleepsThroughNight",
        "sleepDisturbance"
      ];

      var arrayFields = [
        "newbloodPressureSystolic",
        "newbloodPressureDiastolic",
        "newoxygenSaturation",
        "newpulse",
        "newweight",
        "newvitalsPain",
        "newrespiration",
      //  "newpsychosocialStatus",
        "newtemperature",
        "newinternationalNormalizedRatio"
      ];

      for (var i = 0; i < arrayFields.length; ++i) {

        if (oldData[arrayFields[i]] !== newData[arrayFields[i]]) {

          //handeling when the value is an object with a data field
          var newValue = newData[arrayFields[i]];
          if(newValue.data != undefined) {
            newValue = newData[arrayFields[i]].data;
          }

          diff.push({
            "field": arrayFields[i],
            "new": newValue
          });
        }
      }

      for (var i = 0; i < attributeArr.length; ++i) {

        if (oldData[attributeArr[i]] !== newData[attributeArr[i]]) {

          diff.push({
            "field": attributeArr[i],
            "old": oldData[attributeArr[i]],
            "new": newData[attributeArr[i]]
          });
        }
      }

      //handling for date fields
      var dateAttributes = ["admissionDate", "birthDate"];

      for (var i = 0; i < dateAttributes.length; ++i) {

        if (new Date(oldData[dateAttributes[i]]).toDateString() !== new Date(newData[dateAttributes[i]]).toDateString()) {

          diff.push({
            "field": dateAttributes[i],
            "old": oldData[dateAttributes[i]],
            "new": newData[dateAttributes[i]]
          });
        }
      }

      //handling of nested strings
      var nestedAtributes = [{
        f: "personalHabits",
        s: "smokes"
      }, {
        f: "personalHabits",
        s: "alcohol"
      }, {
        f: "personalHabits",
        s: "other"
      }, {
        f: "hearing",
        s: "rightEar"
      }, {
        f: "hearing",
        s: "leftEar"
      }, {
        f: "vision",
        s: "rightEye"
      }, {
        f: "vision",
        s: "leftEye"
      }, {
        f: "teeth",
        s: "upperDentureFit"
      }, {
        f: "teeth",
        s: "lowerDentureFit"
      }, {
        f: "teeth",
        s: "upperTeeth"
      }, {
        f: "teeth",
        s: "lowerTeeth"
      }, {
        f: "insideApartment",
        s: "useOfAssistiveDevice"
      }, {
        f: "insideApartment",
        s: "assitanceWithDevice"
      }, {
        f: "insideApartment",
        s: "specialAmbulationNeeds"
      }, {
        f: "outsideApartment",
        s: "useOfAssistiveDevice"
      }, {
        f: "outsideApartment",
        s: "assitanceWithDevice"
      }, {
        f: "outsideApartment",
        s: "specialAmbulationNeeds"
      }];

      for (var i = 0; i < nestedAtributes.length; ++i) {

        var oldValue = nestedArguments(oldData, nestedAtributes[i].f + "." + nestedAtributes[i].s);

        var newValue = nestedArguments(newData, nestedAtributes[i].f + "." + nestedAtributes[i].s);

        if (oldValue == undefined || newValue == undefined) {
          continue;
        }

        if (oldValue !== newValue) {

          diff.push({
            "field": oldData[nestedAtributes[i].f] + " " + [nestedAtributes[i].s],
            "old": oldValue,
            "new": newValue
          });
        }
      }

      return diff;
    }

    var nestedArguments = function(o, s) {
      s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
      s = s.replace(/^\./, ''); // strip a leading dot
      var a = s.split('.');
      for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
          o = o[k];
        } else {
          return;
        }
      }
      return o;
    }

    var resetFields = function() {
      vm.form.newrespiration = "";
      vm.form.newvitalsPain = "";
      vm.form.newpulse = "";
      vm.form.newweight = "";
      vm.form.newoxygenSaturation = "";
      vm.form.newbloodPressureDiastolic = "";
      vm.form.newbloodPressureSystolic = "";
      vm.form.newtemperature = "";
      vm.form.newinternationalNormalizedRatio = "";

      vm.form.newmedicationAllergies = "";
      vm.form.newfoodAllergies = "";
      vm.form.newfoodLikes = "";
      vm.form.newfoodDislikes = "";
    };

    var pushNewValues = function() {
      addToArray(vm.form.respiration, vm.form.newrespiration);
      addToArray(vm.form.vitalsPain, vm.form.newvitalsPain);
      addToArray(vm.form.pulse, vm.form.newpulse);
      addToArray(vm.form.weight, vm.form.newweight);
      addToArray(vm.form.oxygenSaturation, vm.form.newoxygenSaturation);
      addToArray(vm.form.bloodPressureDiastolic, vm.form.newbloodPressureDiastolic);
      addToArray(vm.form.bloodPressureSystolic, vm.form.newbloodPressureSystolic);
      addToArray(vm.form.temperature, vm.form.newtemperature);
      addToArray(vm.form.internationalNormalizedRatio, vm.form.newinternationalNormalizedRatio);

      vm.form.foodAllergies = vm.form.newfoodAllergies;
      vm.form.medicationAllergies = vm.form.newmedicationAllergies;

      //addToArray(vm.form.psychosocialStatus, vm.form.newpsychosocialStatus);
      vm.form.psychosocialStatus = vm.form.newpsychosocialStatus;

      vm.form.foodLikes = vm.form.newfoodLikes;
      vm.form.foodDislikes = vm.form.newfoodDislikes;
    };

    //when pushing to array make sure we aren't adding invalid data
    function addToArray(arr, value) {

      if (value != undefined) {
        if (value != "") {
          arr.push(value);
          return true;
        }
      } else {
        return false;
      }

    }

  }

})();
