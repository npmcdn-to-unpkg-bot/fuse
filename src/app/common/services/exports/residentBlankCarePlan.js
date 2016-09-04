// documentation: https://parall.ax/products/jspdf

(function() {
  angular.module("app.core").service("exportBlankCarePlan", exportBlankCarePlan);

  exportBlankCarePlan.$inject = [];

  function exportBlankCarePlan() {

    function exportPdf(resident) {

      var doc = new jsPDF('p', 'pt');

      doc.setFont("helvetica");
      doc.setFontSize(12);

      // community logo
      doc.rect(250, 10, 100, 100);
      doc.text("place holder", 260, 50);
      doc.text("for logo", 260, 62);

      // resident picture
      doc.rect(10, 120, 200, 300);
      doc.text("place holder", 60, 250);
      doc.text("for resident picture", 60, 262);

      // resident admin info
      doc.text("First Name", 220, 130);
      doc.text("Prefered Name", 220, 142);
      doc.text("Middle Name", 220, 154);
      doc.text("Last Name", 220, 166);
      doc.text("First Name", 220, 178);

      doc.save(resident.firstName + " " + resident.lastName + ".pdf");
    }

    return {
      exportPdf : exportPdf
    };

  }

})();
