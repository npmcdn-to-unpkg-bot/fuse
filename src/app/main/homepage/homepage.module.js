(function ()
{
    'use strict';

    angular
        .module('app.homepage', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.homepage', {
            url      : '/',
            views    : {
                'main@'                        : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.homepage': {
                    templateUrl: 'app/main/homepage/homepage.html',
                    controller : 'HomepageController as vm'
                }
            },
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/homepage');

    }

})();
