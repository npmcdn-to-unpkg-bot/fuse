(function() {
  angular.module("app.core").service("exportBlankCarePlan", exportBlankCarePlan);

  exportBlankCarePlan.$inject = [];

  function exportBlankCarePlan() {

    function exportPdf(resident) {

      var doc = new jsPDF('p', 'pt');

      doc.text("This care plan is as empty as my life", 100, 50);

      doc.save(resident.firstName + " " + resident.lastName + ".pdf");

    }

    return {
      exportPdf : exportPdf
    };

  }

})();
