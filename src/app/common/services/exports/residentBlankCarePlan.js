// documentation: https://parall.ax/products/jspdf

(function() {
  angular.module("app.core").service("exportBlankCarePlan", exportBlankCarePlan);

  exportBlankCarePlan.$inject = [];

  function exportBlankCarePlan() {

    function exportPdf(resident) {

      var doc = new jsPDF('p', 'pt');

      doc.setFont("helvetica");
      doc.setFontSize(12);
      doc.setLineWidth(1);

      // community logo
      doc.rect(250, 10, 100, 100);
      doc.text("place holder", 260, 50);
      doc.text("for logo", 260, 62);

      doc.text("Phone", 360, 24);
      doc.text("(719) 587-3514", 410, 24);

      doc.text("Fax", 360, 36);
      doc.text("(719) 589-3614", 410, 36);

      doc.text("Address", 360, 48);
      doc.text("3407 Carroll St Alamoa CO, 81101", 410, 48);

      doc.text("Website", 360, 60);
      doc.text("AlamosaBridge.com", 410, 60);

      // resident picture
      doc.rect(10, 120, 200, 300);
      doc.text("place holder", 60, 250);
      doc.text("for resident picture", 60, 262);

      // resident admin info
      doc.text("First Name", 220, 150);
      doc.line(280, 152, 590, 152);

      doc.text("Preferred Name", 220, 174);
      doc.line(306, 176, 590, 176);

      doc.text("Middle Name", 220, 198);
      doc.line(291, 200, 590, 200);

      doc.text("Last Name", 220, 222);
      doc.line(280, 224, 590, 224);

      doc.text("Maiden Name", 220, 246);
      doc.line(297, 248, 590, 248);

      doc.text("Room", 220, 270);
      doc.text("Sex", 390, 270);

      doc.text("Date of Birth", 220, 294);
      doc.text("Admission Date", 390, 294);

      doc.text("Marital Status", 220, 318);
      doc.text("Veteran", 390, 318);

      doc.text("Full Code", 220, 324);
      doc.text("Assessment Interval", 390, 324);

      doc.save(resident.firstName + " " + resident.lastName + ".pdf");
    }

    return {
      exportPdf : exportPdf
    };

  }

})();
