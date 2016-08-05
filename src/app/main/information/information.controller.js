(function ()
{
    angular
        .module('app.information')
        .controller('InformationController', InformationController);

    function InformationController() {
      var vm = this;

      vm.menuItems = [
        "Dashboard",
        "Calendar",
        "Issues",
        "Residents"
      ];

      vm.selectedItem = vm.menuItems[0];

      // Functions
      vm.switchItem = switchItem;

      function switchItem(item) {
        vm.selectedItem = item;
      }

    }

})();
