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
      var formatedEntry = "";

      // if update field exists
      if (entry.updateField) {
        _.forEach(entry.updateField, function(currField) {

          var oldValue = currField.old;
          var newValue = currField.new;
          var field = currField.field;

          // format the date values proper
          if (field === 'admissionDate' || field === 'birthDate') {
            oldValue = moment(oldValue).format('MMMM Do YYYY');
            newValue = moment(newValue).format('MMMM Do YYYY');
          }

          //format the output string that will be shown to the user
          formatedEntry = entry.updateBy + " has updated " + _.startCase(field) + " from " +
            oldValue + " to " + newValue;

          // if this is the first time some value has been set omit old value
          if (!oldValue) {
            formatedEntry = entry.updateBy + " has updated " + _.startCase(field) + " to " +
              newValue;
          }

          //handling of array fields
          if (_.includes(arrayFields, field)) {
            if(newValue !== "") {
              formatedEntry = entry.updateBy + " has added " + newValue + " to " +
                _.startCase(field);
            } else {
              formatedEntry = entry.updateBy + " has removed " + oldValue + " from " +
                _.startCase(field);
            }

          }

          //attaching a time diff at the end (how long ago did we update it)
          formatedEntry += " " + timeDiff(entry.updateDate);

          formatedArray.push(formatedEntry);

        });
      }


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
