(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(authentication, $location, $state)
    {

        var vm = this;

        // if(authentication.isLoggedIn()) {
        //   $state.go("app.appointments");
        // }

        // Methods

        vm.login = function() {
            console.log("in login method");
            console.log(vm.form);

            vm.doLogin();

        }

        vm.doLogin = function() {
            authentication
                .login(vm.form)
                .error(function(err) {
                    vm.formError = err;
                })
                .then(function() {
                    console.log("success login: " + authentication.currentUser().name);
                    console.log(authentication.getToken());

                    $location.path('/appointments');
                });
        };

        //////////
    }
})();
