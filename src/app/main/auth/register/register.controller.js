(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.register')
        .controller('RegisterController', RegisterController);

    /** @ngInject */
    function RegisterController($location, authentication)
    {
        // Data
        var vm = this;

         vm.credentials = {
            name: "",
            email: "",
            password: ""
        };

        // Methods
        vm.register = function() {

            vm.credentials.name = vm.form.username;
            vm.credentials.email = vm.form.email;
            vm.credentials.password = vm.form.password;

            vm.doRegister();
        };

        vm.doRegister = function() {

          vm.notSamePass = "";
          vm.userExists = "";
          vm.emailExists = "";

          if (vm.form.passwordConfirm !== vm.form.password) {
            vm.notSamePass = "The passwords don't match";
            return;
          }

          authentication
            .register(vm.credentials)
            .error(function(error) {

              if (error.err.indexOf("name_1") !== -1) {
                vm.userExists = "This username already exists";
              }

              if (error.err.indexOf("email") !== -1) {
                vm.emailExists = "This email already exists";
              }
            })
            .then(function() {
              console.log("success register: " + authentication.currentUser().name);
              $location.path('/auth/login');
            });
        };
        //////////
    }
})();
