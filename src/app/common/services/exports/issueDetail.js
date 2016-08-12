(function() {
  angular.module("app.core").service("exportIssueDetail", exportIssueDetail);

  exportIssueDetail.$inject = ['$filter', 'imageData'];

  function exportIssueDetail($filter, imageData) {

    function exportPdf(data) {

      var doc = new jsPDF('p', 'pt', 'letter');

      var fileName = "Issue_" + data.title + ".pdf";

      var dateFilter = $filter('date');
      var filteredSubmitDate = dateFilter(data.submitDate, 'MMMM d, yyyy');

      if (data.due) {
        var dueDate = dateFilter(new Date(data.due), 'MMM d, yyyy');
      }

      doc.setFontSize(20);
      doc.setTextColor(33, 33, 33);
      doc.setFont("courier");
      doc.setFontType("bold");
      doc.setLineWidth(25);

      doc.text(40, 40, data.title);
      doc.setFontSize(12);
      doc.text(40, 60, "Created by " + data.submitBy + " on " + filteredSubmitDate);

      doc.setFillColor(33, 150, 243);
      doc.roundedRect(
        188, // x position
        200, // y position | bigger is lower on page
        224, // x length
        18, // y height
        7, 7, // rounded corners
        'F'); // F filled | FD filled with borders



      doc.ellipse(580, 209, 2, 2, 'F');
      doc.ellipse(570, 209, 2, 2, 'F');
      doc.ellipse(560, 209, 2, 2, 'F');
      doc.ellipse(550, 209, 2, 2, 'F');
      doc.ellipse(540, 209, 2, 2, 'F');
      doc.ellipse(530, 209, 2, 2, 'F');
      doc.ellipse(520, 209, 2, 2, 'F');
      doc.ellipse(510, 209, 2, 2, 'F');
      doc.ellipse(500, 209, 2, 2, 'F');
      doc.ellipse(490, 209, 2, 2, 'F');
      doc.ellipse(480, 209, 2, 2, 'F');
      doc.ellipse(470, 209, 2, 2, 'F');
      doc.ellipse(460, 209, 2, 2, 'F');
      doc.ellipse(450, 209, 2, 2, 'F');
      doc.ellipse(440, 209, 2, 2, 'F');
      doc.ellipse(430, 209, 2, 2, 'F');
      doc.ellipse(420, 209, 2, 2, 'F');

      doc.ellipse(180, 209, 2, 2, 'F');
      doc.ellipse(170, 209, 2, 2, 'F');
      doc.ellipse(160, 209, 2, 2, 'F');
      doc.ellipse(150, 209, 2, 2, 'F');
      doc.ellipse(140, 209, 2, 2, 'F');
      doc.ellipse(130, 209, 2, 2, 'F');
      doc.ellipse(120, 209, 2, 2, 'F');
      doc.ellipse(110, 209, 2, 2, 'F');
      doc.ellipse(100, 209, 2, 2, 'F');
      doc.ellipse(90, 209, 2, 2, 'F');
      doc.ellipse(80, 209, 2, 2, 'F');
      doc.ellipse(70, 209, 2, 2, 'F');
      doc.ellipse(60, 209, 2, 2, 'F');
      doc.ellipse(50, 209, 2, 2, 'F');
      doc.ellipse(40, 209, 2, 2, 'F');
      doc.ellipse(30, 209, 2, 2, 'F');
      doc.ellipse(20, 209, 2, 2, 'F');


      // if due date exists
      if (data.due) {
        doc.text(40, 124, "Due date: ");
        doc.text(200, 124, dueDate);
      }

      var commentLength = 70;
      var leftofPoint = 0;
      for (var i = 0; i < data.comments.length; ++i) {
        var comment = data.comments[i];

        doc.text(40, 310 + i * 36 + leftofPoint, "Author: " + comment.author);

        if (comment.commentText.length > commentLength) {
          var numTimes = Math.floor(comment.commentText.length / commentLength);

          for (var j = 0; j < numTimes; ++j) {
            var txt = "";
            if (j === 0) {
              txt = "Text: ";
            }
            doc.text(40, 325 + i * 36 + j * 12 + leftofPoint, txt + comment.commentText.substr(j * (commentLength), commentLength));
          }
          leftofPoint = numTimes * 12;
        } else {
          doc.text(40, 325 + i * 36 + leftofPoint, "Text: " + comment.commentText);
        }
      }

      doc.save(fileName);

    }


    return {
      exportPdf : exportPdf
    };

  }

})();
