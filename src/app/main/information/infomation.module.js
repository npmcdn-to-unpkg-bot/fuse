(function ()
{
    'use strict';

    angular
        .module('app.information', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.information', {
            url      : '/information',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/information/information.html',
                    controller : 'MailController as vm'
                }
            },
            bodyClass: 'information'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/information');


        // Navigation
        msNavigationServiceProvider.saveItem('fuse', {
            title : 'ApilaCare',
            group : true,
            weight: 1
        });

        msNavigationServiceProvider.saveItem('fuse.information', {
            title    : 'Information',
            icon     : 'icon-book-open',
            state    : 'app.information',
            weight   : 2
        });
    }
})();
