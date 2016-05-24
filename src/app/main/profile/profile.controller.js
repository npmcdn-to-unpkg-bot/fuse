(function ()
{
    'use strict';

    angular
        .module('app.profile')
        .controller('ProfileController', ProfileController);

    /** @ngInject */
    function ProfileController(authentication)
    {
        var vm = this;

        // Data
        vm.username = authentication.currentUser().name;

        // Methods

        //////////
    }

})();
