(function ()
{
    'use strict';

    angular
        .module('app.homepage')
        .controller('HomepageController', HomepageController);

    /** @ngInject */
    function HomepageController($mdDialog, $document)
    {
        // Data
        var vm = this;

        // Methods
        vm.openCommunityModal = openCommunityModal;

        //////////

        function openCommunityModal(ev)
        {
          $mdDialog.show({
              controller         : 'CreateCommunityController',
              controllerAs       : 'vm',
              templateUrl        : 'app/main/homepage/dialogs/createCommunity.html',
              parent             : angular.element($document.body),
              targetEvent        : ev,
              clickOutsideToClose: true
          });
        }

    }
})();
