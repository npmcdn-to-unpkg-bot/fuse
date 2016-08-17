(function ()
{
    'use strict';

    angular
        .module('fuse')
        .controller('IdleController', IdleController);

    /** @ngInject */
    function IdleController($mdDialog, $state)
    {
      //Data
      var vm = this;

      //Functions
      vm.login = login;


      function login() {
        $mdDialog.hide();
        $state.go('app.pages_auth_login');
      }

    }

})();
