(function() {

  'use strict';

  angular
    .module('app.residents')
    .service('ResidentUpdateInfoService', ResidentUpdateInfoService);


  /** @ngInject */
  function ResidentUpdateInfoService(apilaData, authentication) {

    var username = authentication.currentUser().name;

    function formatUpdateArray(updateArray) {

      var arrayFields = ['foodAllergies', 'medicationAllergies'];

      var formatedArray = [];

      _.forEach(updateArray, function(entry, key) {
        var formatEntry = {
          'text': '',
          'diffTime': '',
          'username': ''
        };

        // if update field exists
        if (entry.updateField) {
          _.forEach(entry.updateField, function(currField) {

            var oldValue = currField.old;
            var newValue = currField.new;
            var field = currField.field;

            formatEntry.username = entry.updateBy;

            // format the date values proper
            if (field === 'admissionDate' || field === 'birthDate') {
              oldValue = moment(oldValue).format('MMMM Do YYYY');
              newValue = moment(newValue).format('MMMM Do YYYY');
            }

            //format the output string that will be shown to the user
            formatEntry.text = " has updated " + _.startCase(field) + " from " +
              oldValue + " to " + newValue;

            // if this is the first time some value has been set omit old value
            if (!oldValue) {
              formatEntry.text = " has updated " + _.startCase(field) + " to " +
                newValue;
            }

            //handling of array fields
            if (_.includes(arrayFields, field)) {
              if (newValue !== "") {
                formatEntry.text = " has added " + newValue + " to " +
                  _.startCase(field);
              } else {
                formatEntry.text =  " has removed " + oldValue + " from " +
                  _.startCase(field);
              }

            }

            //attaching a time diff at the end (how long ago did we update it)
            formatEntry.diffTime += " " + timeDiff(entry.updateDate);

            formatedArray.push(formatEntry);

          });
        }


      });


      return formatedArray;

    }

    function timeDiff(date) {
      var start = moment(date);
      var end = moment();

      var duration = moment.duration(end.diff(start));

      if (duration.asSeconds() < 60) {
        return Math.floor(duration.asSeconds()) + " seconds ago";
      } else if (duration.asMinutes() < 60) {
        return Math.floor(duration.asMinutes()) + " minutes ago";
      } else if (duration.asHours() < 24) {
        return Math.floor(duration.asHours()) + " hours ago";
      } else if (duration.asDays() < 31) {
        return Math.floor(duration.asDays()) + " days ago";
      } else if (duration.asMonths() < 12) {
        return Math.floor(duration.asMonths()) + " months ago";
      } else {
        return Math.floor(duration.asYears()) + " years ago";
      }

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
        "room",
        "veteran",
        "maritalStatus",
        "buildingStatus",
        "administrativeNotes",

        // bathing
        "typeOfBathing",
        "timeOfBathing",
        "frequencyOfBathing",
        "acceptanceOfBathing",
        "dislikesBathingDescribe",
        "bathingNotes",

        // continent
        "bowelContinent",
        "constipated",
        "laxative",
        "bladderContinent",
        "dribbles",
        "catheter",
        "toiletingDevice",
        "catheterDescribe",
        "continentNotes",

        // life
        "religion",
        "education",
        "occupation",
        "lifeNotes",
        "contribution",

        // mobility
        "transfers",
        "fallRisk",
        "fallRiskDescribe",
        "bedReposition",
        "mobilityNotes",

        // nutrition
        "overallNutrition",
        "poorNutritionIntervention",
        "diabetic",
        "diabeticType",
        "bloodSugarMonitoring",
        "bedtimeSnack",
        "adaptiveEquipment",
        "needsFoodInSmallPeices",
        "typeOfDiet",
        "fingerFoods",
        "nutritionNotes",

        // pain
        "hasPain",
        "painLocation",
        "painDescription",
        "maxPainTime",
        "painIncreasedBy",
        "painDecreasedBy",
        "painLength",
        "painNotes",

        // physical
        "skinCondition",
        "hasWound",
        "hasWoundDescribe",
        "woundAmount",
        "wearsHearingAid",
        "helpWithHearingAid",
        "helpWithHearingAidDescribe",
        "leftEar",
        "rightEar",
        "leftEye",
        "rightEye",
        "visionNotes",
        "hearingNotes",
        "dentistName",
        "upperDentureFit",
        "upperDentureFitDescribe",
        "upperTeeth",
        "lowerDentureFit",
        "lowerDentureFitDescribe",
        "lowerTeeth",
        "teethCondition",
        "physicalNotes",

        // psychosocial
        "psychosocialStatusDescribe",
        "psychosocialResponsiveness",
        "mood",
        "comprehension",
        "smokes",
        "smokesDescribe",
        "alcohol",
        "alcoholDescribes",
        "sexualActive",
        "generalActivityParticipation",
        "diningRoomParticipation",
        "busRideParticipation",
        "fitnessClassParticipation",
        "bingoParticipation",
        "communityParticipation",
        "drivesCar",
        "licensePlateNumber",
        "spareKeyLocation",
        "drivingNeeds",
        "timeInRoom",
        "preferedActivites",
        "useFitnessEquipmentIndependently",
        "highMaintenance",
        "familyInvolvement",
        "psychosocialNotes",

        // sleep
        "usualBedtime",
        "usualArisingTime",
        "nap",
        "napDescribe",
        "assistanceToBed",
        "sleepsThroughNight",
        "sleepDisturbance",
        "canCallForAssistance",
        "sleepNotes"
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

          //handling when the value is an object with a data field
          var newValue = newData[arrayFields[i]];
          if (newValue.data != undefined) {
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

        if (newValue == undefined) {
          continue;
        }

        if (oldValue !== newValue) {

          diff.push({
            "field": nestedAtributes[i].f + " " + [nestedAtributes[i].s],
            "old": oldValue,
            "new": newValue
          });
        }
      }

      // handlng movedFrom updateInfo check if name are diff
      if (newData.locationInfo.formatted_address) {
        if (oldData['movedFrom'].name !== newData.locationInfo.formatted_address) {
          diff.push({
            "field": 'movedFrom',
            "old": oldData['movedFrom'].name,
            "new": newData.locationInfo.formatted_address
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
    };



    return {
      formatUpdateArray: formatUpdateArray,
      checkChangedFields: checkChangedFields
    };

  }


})();
