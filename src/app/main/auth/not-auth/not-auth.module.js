(function ()
{
    'use strict';

    angular
        .module('app.not-auth', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.not-auth', {
            url      : '/not-auth',
            views    : {
                'main@'                        : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.not-auth': {
                    templateUrl: 'app/main/auth/not-auth/not-auth.html',
                    controller : 'NotAuthController as vm'
                }
            },
            bodyClass: 'not-auth'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/auth/not-auth');

    }

})();
