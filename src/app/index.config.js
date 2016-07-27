(function ()
{
    'use strict';

    angular
        .module('fuse')
        .config(config);

    /** @ngInject */
    function config()
    {
        // Put your custom configurations here
        // stripe published key (test version for now)
        Stripe.setPublishableKey('pk_test_PDxs7SyxPARytJkKUeS6NOS8');
    }

})();
