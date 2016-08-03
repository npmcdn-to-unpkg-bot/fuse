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

          var wordCloudText = "";
          for (var i = 0; i < issue.comments.length; ++i) {
              wordCloudText += " " + issue.comments[i].commentText;
          }

          // adding description to the word cloud
          wordCloudText += " " + issue.description;

          // adding cheklist items name to te word cloud
          angular.forEach(issue.checklists, function(v, k) {
            angular.forEach(v.checkItems, function(item, key) {
              wordCloudText += " " + item.name;
            });
          });


          return wordCloudText.split(" ");

      }

    }

})();
