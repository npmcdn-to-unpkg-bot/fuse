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
      var FIVE_MIN = 300;

        // Put your custom configurations here
        // stripe published key (test version for now)
        Stripe.setPublishableKey('pk_test_PDxs7SyxPARytJkKUeS6NOS8');

        IdleProvider.idle(3*HOUR); // 30 minutes
        IdleProvider.timeout(FIVE_MIN);
        KeepaliveProvider.interval(5);
    }

})();
