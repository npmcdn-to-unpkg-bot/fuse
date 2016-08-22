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

        // Methods

        vm.login = function() {

            vm.doLogin();

        };

        vm.doLogin = function() {
            authentication
                .login(vm.form)
                .error(function(err) {
                    vm.usernameError = "";
                    vm.passwordError = "";

                    if(err.message === "Incorrect username.") {
                      vm.usernameError = "Incorrect Email";
                      vm.passwordError = "";
                    } else {
                      vm.passwordError = "Incorrect Password for this Email";
                      vm.usernameError = "";
                    }
                })
                .then(function() {
                  vm.usernameError = "";
                  vm.passwordError = "";

                    $location.path('/dashboard');
                });
        };

        //////////
    }
})();
