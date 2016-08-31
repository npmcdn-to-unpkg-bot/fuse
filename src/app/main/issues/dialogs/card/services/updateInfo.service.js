(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .service('UpdateInfoService', UpdateInfoService);


    /** @ngInject */
    function UpdateInfoService(apilaData, authentication) {


      function checkChangedFields(oldData, newData, selectedMember) {

         var diff = [];
         var attributeArr = ["title", "resolutionTimeframe", "description"];

         for (var i = 0; i < attributeArr.length; ++i) {

             if (oldData[attributeArr[i]] !== newData[attributeArr[i]]) {

                 diff.push({
                     "field": attributeArr[i],
                     "old": oldData[attributeArr[i]],
                     "new": newData[attributeArr[i]]
                 });
             }
         }

         var memDiff = null;

         //member updates, deleted
         if(selectedMember !== undefined) {

             diff.push({
               "field" : "idMemebers",
               "old" : selectedMember,
               "new" : ""
             });
         }
         //added some member
         else if(oldData.idMembers.length < newData.idMembers.length) {
           memDiff = _.differenceBy(newData.idMembers,
                oldData.idMembers, "name");

           if(memDiff.length > 0) {
             diff.push({
               "field" : "idMemebers",
               "old" : "",
               "new" : newData.idMembers[newData.idMembers.length-1].name
             });
           }
       }

         return diff;
     }



      /**
      * Gets an array of updateFields and formates them from proper display
      */
      function formatUpdateArray(updateInfo, updatedBy, updateDate) {
        _.forEach(updateInfo, function(v, k) {
          v.infoFormated = " changed " + v.field +
                            " from " + v.old + " to " + v.new;

          v.userName = updatedBy.name;
          v.userImage = updatedBy.userImage;

         //formating for members
         if(v.field === "idMembers") {
           if(v.old === "") {
             v.infoFormated =  " added a member ";
             v.tooltip = v.new;
           } else {
             v.infoFormated =  " removed a member ";
             v.tooltip = v.old;
           }
         }

         //formating for attachemnts
         if(v.field === "attachments") {
           if(v.old === "") {
             v.infoFormated =  " uploaded an attachment ";
             v.tooltip = v.new;
           } else {
             v.infoFormated =  " removed an attachment ";
             v.tooltip = v.old;
           }
         }

         //formating for labels
         if(v.field === "labels") {
           if(v.old === "") {
             v.infoFormated =  "added a label ";
             v.tooltip = v.new;
           } else {
             v.infoFormated =  "removed a label ";
             v.tooltip = v.old;
           }
         }

         //formating for checklists
         if(v.field === "checklists") {
           if(v.old === "") {
             v.infoFormated =  " added a checklist ";
             v.tooltip = v.new;
           } else {
             v.infoFormated =  " removed a checklist ";
             v.tooltip = v.old;
           }
         }

         //formating for checklists item
         if(v.field === "checkitem") {
           if(v.old === "") {
             v.infoFormated =  " created a checklist item ";
             v.tooltip = v.new;
           } else {
             v.infoFormated =  " removed a checklist item";
              v.tooltip = v.old;
           }
         }

         if(v.field === "checkitem_complete") {
           if(v.old === "") {
             v.infoFormated =  " completed a checklist item ";
             v.tooltip = v.new;
           } else {
             v.infoFormated =  " uncompleted a checklist item";
             v.tooltip = v.old;
           }
         }


         if(v.field === "checkitem_change") {
             v.infoFormated =  " changed a checklist item ";
             v.tooltip = v.old;
         }

         if(v.field === "checkitem_remove") {
             v.infoFormated =  " removed a checklist item ";
             v.tooltip = v.old;
         }

         if(v.field === "checkitem_checked") {
             v.infoFormated =  " completed a checklist item ";
             v.tooltip = v.new;
         }

         if(v.field === "checkitem_unchecked") {
             v.infoFormated =  " uncompleted a checklist item ";
             v.tooltip = v.new;
         }

         if(v.field === "comments") {
           if(v.old === "") {
             v.infoFormated =  " added a comment ";
             v.tooltip = v.new;
           } else {
             v.infoFormated =  " removed a comment";
             v.tooltip = v.old;
           }
         }

         if(v.field === "due") {
           if(v.old === "") {
             v.infoFormated =  " added a due date " + moment(+v.new).format('MMMM Do YYYY, h:mm:ss a') ;
           } else {
             v.infoFormated =  " removed a due date " + moment(+v.old).format('MMMM Do YYYY, h:mm:ss a') ;
           }
         }

         if(v.field === "status") {
           v.infoFormated =  " changed the issue status to " + v.new ;
         }

         if(v.field === "description") {
           v.infoFormated =  " changed " + v.field + " to " + v.new;
         }

         v.timeDiff = timeDiff(updateDate);

        });

        return updateInfo;
      }

      /**
      * Sets the update info for updating label/attachemnts/checklists
      */
      function setUpdateInfo(fieldName, newField, oldField) {
        var updateInfo = {};

        updateInfo.updateBy = authentication.currentUser().id;
        updateInfo.updateDate = new Date();
        updateInfo.updateField = [];
        updateInfo.updateField.push({
          "field": fieldName,
          "new": newField,
          "old": oldField
        });

        return updateInfo;
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
        setUpdateInfo : setUpdateInfo,
        formatUpdateArray : formatUpdateArray,
        checkChangedFields : checkChangedFields,
        timeDiff : timeDiff
      }
    }

})();
