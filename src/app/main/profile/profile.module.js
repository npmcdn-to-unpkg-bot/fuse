(function ()
{
    'use strict';

    angular
        .module('app.profile', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        $stateProvider.state('app.profile', {
            url      : '/profile',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/profile/profile.html',
                    controller : 'ProfileController as vm'
                }
            },

            bodyClass: 'profile'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/profile');

    }

})();
