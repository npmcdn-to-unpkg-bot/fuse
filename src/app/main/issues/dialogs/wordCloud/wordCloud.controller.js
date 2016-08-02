(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .controller('WordCloudController', WordCloudController);

    /** @ngInject */
    function WordCloudController($mdDialog, issue, wordCloud, $timeout) {

      var vm = this;

      vm.closeDialog = closeDialog;

      function closeDialog()
        {
          $mdDialog.hide();
        }

      $timeout(function () {
          wordCloud.drawWordCloud(createWordArray());
      }, 100);


        // gets all the comments and issue description and converts them to word array
      function createWordArray() {

          var commentText = "";
          for (var i = 0; i < issue.comments.length; ++i) {
              commentText += " " + issue.comments[i].commentText;
          }

          commentText += " " + issue.description;

          return commentText.split(" ");

      }

    }

})();
