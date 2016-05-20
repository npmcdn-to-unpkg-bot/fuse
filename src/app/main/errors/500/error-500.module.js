(function ()
{
    'use strict';

    angular
        .module('app.error-500', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.errors_error-500', {
            url      : '/errors/error-500',
            views    : {
                'main@'                             : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.errors_error-500': {
                    templateUrl: 'app/main/errors/500/error-500.html',
                    controller : 'Error500Controller as vm'
                }
            },
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/errors/500');

    }

})();
