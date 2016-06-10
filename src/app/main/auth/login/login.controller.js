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
            console.log("in login method");
            console.log(vm.form);

            vm.doLogin();

        }

        vm.doLogin = function() {
            authentication
                .login(vm.form)
                .error(function(err) {
                  console.log(err);
                    vm.usernameError = "";
                    vm.passwordError = "";
                    if(err.message === "Incorrect username.") {
                      vm.usernamError = "Incorrect username.";
                      vm.passwordError = "";
                    } else {
                      vm.passwordError = "Incorrect password.";
                    }
                })
                .then(function() {
                  vm.usernameError = "";
                  vm.passwordError = "";

                    $location.path('/appointments');
                });
        };

        //////////
    }
})();
