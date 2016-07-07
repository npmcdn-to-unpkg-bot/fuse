(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .controller('ImageViewController', ImageViewController);


   /** @ngInject */
   function ImageViewController($mdDialog, imgUrl) {
     var vm = this;

     vm.imgUrl = imgUrl;


     vm.cancel = function(){
       $mdDialog.hide();
     }


   }

 })();
