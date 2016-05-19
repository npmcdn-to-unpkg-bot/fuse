(function ()
{
    'use strict';

    angular
        .module('app.homepage')
        .controller('HomepageController', HomepageController);

    /** @ngInject */
    function HomepageController(authentication, $state)
    {
        // Data

        // Methods
        if(authentication.isLoggedIn()) {
          $state.go("app.appointments");
        }

        //////////
    }
})();
