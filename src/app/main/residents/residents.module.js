(function ()
{
    'use strict';

    angular
        .module('app.residents', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.residents', {
            url      : '/residents',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/residents/residents.html',
                    controller : 'MailController as vm'
                }
            },
            bodyClass: 'residents'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/residents');


        // Navigation
        msNavigationServiceProvider.saveItem('fuse', {
            title : 'ApilaCare',
            group : true,
            weight: 1
        });

        msNavigationServiceProvider.saveItem('fuse.residents', {
            title    : 'Residents',
            icon     : 'icon-account-multiple',
            state    : 'app.residents',
            weight   : 1
        });
    }
})();
