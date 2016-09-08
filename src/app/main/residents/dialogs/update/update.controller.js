(function() {
  'use strict'

  angular.module('app.residents')
    .controller('UpdateController', UpdateController);

  /** @ngInject */
  function UpdateController($mdDialog, $mdConstant, Upload, $timeout, currResident, apilaData, authentication, ResidentUpdateInfoService) {

    var vm = this;

    //filling in old data for the update
    vm.form = currResident;

    vm.form.contacts = {};

    vm.status = createMultiSelect(["Alert", "Friendly", "Disoriented",
                                    "Withdrawn", "Lonely", "Happy", "Confused", "Uncooperative",
                                    "At times angry", "Sad", "Emotional outbursts", "Feel like a burden"]);

    vm.shopping = createMultiSelect(["Family", "Self", "Friend"]);

    vm.painManagedBy = createMultiSelect(['Medication', 'Hot pack', 'Cold pack', 'Positioning', 'Topicals']);

    setSelectedStatuses(currResident.psychosocialStatus);
    setSelectedShopping(currResident.shopping);
    setSelectedPainManagedBy(currResident.painManagedBy);

    vm.foodAllergies = currResident.foodAllergies;
    vm.medicationAllergies = currResident.medicationAllergies;

    vm.foodLikes = currResident.foodLikes;
    vm.foodDislikes = currResident.foodDislikes;

    //needed unchanged values to compare for updateField
    vm.copyResident = angular.copy(currResident);

    vm.seperators = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA];

    vm.autocompleteOptions = {
      componentRestrictions: {
        country: 'us'
      }
    };

    vm.form.birthDate = new Date(currResident.birthDate);
    vm.form.admissionDate = new Date(currResident.admissionDate);
    vm.form.locationInfo = vm.form.movedFrom.name;

    //Functions
    vm.closeDialog = closeDialog;
    vm.updateResident = updateResident;
    vm.updateChip = updateChip;
    vm.uploadFiles = uploadFiles;

    function closeDialog() {
      $mdDialog.hide();
    }

    //before sending to server set all the fields and format them correctly
    function formatData() {

      vm.form.modifiedBy = authentication.currentUser().id;
      vm.form.modifiedDate = new Date();

      var changedFields =
        ResidentUpdateInfoService.checkChangedFields(vm.copyResident, vm.form);

      addToStatusArray();
      addToShoppingArray();

      addToPainManagedBy();

      if (vm.form.locationInfo.geometry !== undefined) {
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

      vm.form.newfoodAllergies = vm.foodAllergies;
      vm.form.newmedicationAllergies = vm.medicationAllergies;

      vm.form.newfoodLikes = vm.foodLikes;
      vm.form.newfoodDislikes = vm.foodDislikes;

      //important to set updateInfo when adding/removing chips because they will generate updateInfo
      vm.form.updateInfo = currResident.updateInfo;


      apilaData.updateResident(currResident._id, vm.form)
        .success(function(resident) {

          //currResident.updateInfo.push(resident.updateInfo[resident.updateInfo.length - 1]);
          currResident.updateInfo = resident.updateInfo;

          pushNewValues();
          resetFields();

          closeDialog();
        })
        .error(function(response) {
          console.log(response);
        });
      return false;
    }


    function addToShoppingArray() {
      vm.form.newShoppingStatus = [];

      for (var i = 0; i < vm.shopping.length; ++i) {
        if (vm.shopping[i].active == true) {
          vm.form.newShoppingStatus.push(vm.shopping[i].title);
        }
      }
    }

    function setSelectedPainManagedBy(arr) {
      for (var i = 0; i < vm.painManagedBy.length; ++i) {
        var checkedElem = _.find(vm.painManagedBy, function(d) {
          if (d.title == arr[i]) {
            return d;
          }
        });

        if (checkedElem != undefined) {
          checkedElem.active = true;
        }
      }
    }

    // sets which psychosocialStatus is checked
    function setSelectedShopping(arr) {

      for (var i = 0; i < vm.shopping.length; ++i) {
        var checkedElem = _.find(vm.shopping, function(d) {
          if (d.title == arr[i]) {
            return d;
          }
        });

        if (checkedElem != undefined) {
          checkedElem.active = true;
        }
      }
    }

    function addToStatusArray() {
      vm.form.newpsychosocialStatus = [];

      for (var i = 0; i < vm.status.length; ++i) {
        if (vm.status[i].active === true) {
          vm.form.newpsychosocialStatus.push(vm.status[i].title);
        }

      }
    }


    function addToPainManagedBy() {
      vm.form.newPainManagedBy = [];

      for (var i = 0; i < vm.painManagedBy.length; ++i) {
        if (vm.painManagedBy[i].active === true) {
          vm.form.newPainManagedBy.push(vm.painManagedBy[i].title);
        }

      }
    }

    // sets which psychosocialStatus is checked
    function setSelectedStatuses(arr) {

      for (var i = 0; i < vm.status.length; ++i) {
        var checkedElem = _.find(vm.status, function(d) {
          if (d.title == arr[i]) {
            return d;
          }
        });

        if (checkedElem != undefined) {
          checkedElem.active = true;
        }
      }
    }

    function uploadFiles(file, errFiles) {

      var uploadUrl = apilaData.getApiUrl() + '/api/residents/'+ currResident._id + '/upload';

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
                  vm.fileUploaded = true;
              });

          });
      }
    }

    function updateChip(list, type, chip, operation) {

      var data = {
        "operation": operation,
        "list": list,
        "type": type,
        "selectedItem": chip,
        "updateBy": authentication.currentUser().name
      };

      apilaData.updateListItem(vm.copyResident._id, data)
        .success(function(response) {
          currResident = response;
        })
        .error(function(response) {
          console.log(response);
        });
    }

    // Builds up proper array of object for multi select fields like psyho status
    function createMultiSelect(titleArray) {

      var selectArr = [];

      for(var i = 0; i < titleArray.length; ++i) {
        selectArr.push({
          active : false,
          title: titleArray[i]
        });
      }

      return selectArr;
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
      vm.form.shopping = vm.form.newShoppingStatus;
      vm.form.painManagedBy = vm.form.newPainManagedBy;

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
