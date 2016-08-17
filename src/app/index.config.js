(function ()
{
    'use strict';

    angular
        .module('fuse')
        .config(config);

    /** @ngInject */
    function config(KeepaliveProvider, IdleProvider)
    {
      var HOUR = 3600; //One hour in seconds

        // Put your custom configurations here
        // stripe published key (test version for now)
        Stripe.setPublishableKey('pk_test_PDxs7SyxPARytJkKUeS6NOS8');

        IdleProvider.idle(HOUR);
        IdleProvider.timeout(5);
        KeepaliveProvider.interval(5);
    }

})();
