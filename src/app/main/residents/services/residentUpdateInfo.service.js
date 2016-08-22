(function() {

  'use strict';

  angular
      .module('app.residents')
      .service('ResidentUpdateInfoService', ResidentUpdateInfoService);


  /** @ngInject */
  function ResidentUpdateInfoService(apilaData, authentication) {

    var username = authentication.currentUser().name;

    function formatUpdateArray(updateArray) {

      var arrayFields = ['newfoodAllergies', 'newmedicationAllergies'];

      var formatedArray = [];

      _.forEach(updateArray, function(entry, key) {
        var formatedEntry = "";

        if(entry.updateField) {
          formatedEntry = entry.updateBy + " has updated " + _.startCase(entry.updateField[0].field) + " from " +
                         entry.updateField[0].old + " to " + entry.updateField[0].new;

          if(!entry.updateField[0].old) {
            formatedEntry = entry.updateBy + " has updated " + _.startCase(entry.updateField[0].field) + " to " +
                            entry.updateField[0].new;
          }

          console.log(entry.updateField[0].field);

          if(_.includes(arrayFields, entry.updateField[0].field)) {
            formatedEntry = entry.updateBy + " has added " + entry.updateField[0].new + " to " +
                            _.startCase(entry.updateField[0].field);
          }

          formatedEntry += " " + timeDiff(entry.updateDate);

        }

        formatedArray.push(formatedEntry);
      });


      return formatedArray;

    }


    function timeDiff(date) {
      var start = moment(date);
      var end = moment();

      var duration = moment.duration(end.diff(start));

      if(duration.asSeconds() < 60) {
        return Math.floor(duration.asSeconds()) + " seconds ago";
      } else if(duration.asMinutes() < 60) {
        return Math.floor(duration.asMinutes()) + " minutes ago";
      } else if(duration.asHours() < 24) {
        return Math.floor(duration.asHours()) + " hours ago";
      } else if(duration.asDays() < 31) {
        return Math.floor(duration.asDays()) + " days ago";
      } else if(duration.asMonths() < 12) {
        return Math.floor(duration.asMonths()) + " months ago";
      } else {
        return Math.floor(duration.asYears()) + " years ago";
      }

    }

    return {
      formatUpdateArray : formatUpdateArray
    };

  }


})();
