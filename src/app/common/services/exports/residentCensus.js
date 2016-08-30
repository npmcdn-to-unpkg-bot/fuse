(function() {
  angular.module("app.core").service("exportResidentCensus", exportResidentCensus);

  exportResidentCensus.$inject = [];

  function exportResidentCensus() {

    function exportPdf(inBuildingResidents) {

      var doc = new jsPDF('p', 'pt');

      angular.forEach(inBuildingResidents, function(resident, i) {
        doc.text("Perfered name: " + resident.aliasName, 100, 30 + (i*35));
        doc.text("Last name: " + resident.lastName, 100, 50 + (i*35));
      });

      doc.save("ResidentCensus.pdf");

    }

    return {
      exportPdf : exportPdf
    };

  }

})();
