(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .service('UpdateInfoService', UpdateInfoService);


    /** @ngInject */
    function UpdateInfoService(apilaData, authentication) {


      function checkChangedFields(oldData, newData, selectedMember) {

        console.log(oldData);
        console.log(newData);

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
      function formatUpdateArray(updateInfo, updatedBy) {
        _.forEach(updateInfo, function(v, k) {
          v.infoFormated = updatedBy + " changed " + v.field
                           + " from " + v.old + " to " + v.new;

         //formating for members
         if(v.field === "idMemebers") {
           if(v.old === "") {
             v.infoFormated = updatedBy + " added member " + v.new;
           } else {
             v.infoFormated = updatedBy + " removed member " + v.old;
           }
         }

         //formating for attachemnts
         if(v.field === "attachments") {
           if(v.old === "") {
             v.infoFormated = updatedBy + " uploaded attachment " + v.new;
           } else {
             v.infoFormated = updatedBy + " removed attachment " + v.old;
           }
         }

         //formating for labels
         if(v.field === "labels") {
           if(v.old === "") {
             v.infoFormated = updatedBy + " added label " + v.new;
           } else {
             v.infoFormated = updatedBy + " removed label " + v.old;
           }
         }

         //formating for checklists
         if(v.field === "checklists") {
           if(v.old === "") {
             v.infoFormated = updatedBy + " added checklist " + v.new;
           } else {
             v.infoFormated = updatedBy + " removed checklist " + v.old;
           }
         }

         //formating for checklists item
         if(v.field === "checkitem") {
           if(v.old === "") {
             v.infoFormated = updatedBy + " added checklist item " + v.new;
           } else {
             v.infoFormated = updatedBy + " removed checklist item" + v.old;
           }
         }

        });

        return updateInfo;
      }

      /**
      * Sets the update info for updating label/attachemnts/checklists
      */
      function setUpdateInfo(fieldName, newField, oldField) {
        var updateInfo = {};

        console.log("update");

        updateInfo.updateBy = authentication.currentUser().name;
        updateInfo.updateDate = new Date();
        updateInfo.updateField = [];
        updateInfo.updateField.push({
          "field": fieldName,
          "new": newField,
          "old": oldField
        });

        return updateInfo;
      }

      return {
        setUpdateInfo : setUpdateInfo,
        formatUpdateArray : formatUpdateArray,
        checkChangedFields : checkChangedFields
      }
    }

})()
