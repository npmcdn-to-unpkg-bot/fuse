(function() {
  angular.module("app.core").service("exportFaceSheet", exportFaceSheet);

  exportFaceSheet.$inject = [];

  function exportFaceSheet() {

    function exportPdf(resident) {

      var doc = new jsPDF('p', 'pt');

      doc.text("First name: " + resident.firstName, 100, 50);
      doc.text("Last name: " + resident.lastName, 100, 75);

      doc.save(resident.firstName + " " + resident.lastName + ".pdf");

    }

    return {
      exportPdf : exportPdf
    };

  }

})();
