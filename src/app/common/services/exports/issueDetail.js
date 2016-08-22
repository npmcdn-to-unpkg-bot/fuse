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
        100, // y position | bigger is lower on page
        224, // x length
        18, // y height
        7, 7, // rounded corners
        'F'); // F filled | FD filled with borders

      doc.ellipse(580, 109, 2, 2, 'F');
      doc.ellipse(570, 109, 2, 2, 'F');
      doc.ellipse(560, 109, 2, 2, 'F');
      doc.ellipse(550, 109, 2, 2, 'F');
      doc.ellipse(540, 109, 2, 2, 'F');
      doc.ellipse(530, 109, 2, 2, 'F');
      doc.ellipse(520, 109, 2, 2, 'F');
      doc.ellipse(510, 109, 2, 2, 'F');
      doc.ellipse(500, 109, 2, 2, 'F');
      doc.ellipse(490, 109, 2, 2, 'F');
      doc.ellipse(480, 109, 2, 2, 'F');
      doc.ellipse(470, 109, 2, 2, 'F');
      doc.ellipse(460, 109, 2, 2, 'F');
      doc.ellipse(450, 109, 2, 2, 'F');
      doc.ellipse(440, 109, 2, 2, 'F');
      doc.ellipse(430, 109, 2, 2, 'F');
      doc.ellipse(420, 109, 2, 2, 'F');

      doc.ellipse(180, 109, 2, 2, 'F');
      doc.ellipse(170, 109, 2, 2, 'F');
      doc.ellipse(160, 109, 2, 2, 'F');
      doc.ellipse(150, 109, 2, 2, 'F');
      doc.ellipse(140, 109, 2, 2, 'F');
      doc.ellipse(130, 109, 2, 2, 'F');
      doc.ellipse(120, 109, 2, 2, 'F');
      doc.ellipse(110, 109, 2, 2, 'F');
      doc.ellipse(100, 109, 2, 2, 'F');
      doc.ellipse(90,  109, 2, 2, 'F');
      doc.ellipse(80, 109, 2, 2, 'F');
      doc.ellipse(70, 109, 2, 2, 'F');
      doc.ellipse(60, 109, 2, 2, 'F');
      doc.ellipse(50, 109, 2, 2, 'F');
      doc.ellipse(40, 109, 2, 2, 'F');
      doc.ellipse(30, 109, 2, 2, 'F');
      doc.ellipse(20, 109, 2, 2, 'F');

      var descriptionLength = 78;
      var descLeftofPoint = 0;
      doc.text(260, 112, "Description");

      if (data.description.length > descriptionLength) {
        var numTimes = Math.floor(data.description.length / descriptionLength);

        for (var j = 0; j < numTimes; ++j) {
          var txt = "";

          doc.text(20, 130 + j * 12 + descLeftofPoint, txt + data.description.substr(j * (descriptionLength), descriptionLength));
        }

        descLeftofPoint = numTimes * 12;

      } else {
        doc.text(20, 130 + descLeftofPoint, "" + data.description);
      }


      // if due date exists
      if (data.due) {
        doc.text(40, 124, "Due date: ");
        doc.text(200, 124, dueDate);
      }

      var commentLength = 70;
      var leftofPoint = 0;

      // for loop to grab all comments
      for (var i = 0; i < data.comments.length; ++i) {
        var comment = data.comments[i];

        doc.text(40, 310 + i * 36 + leftofPoint, "Author: " + comment.author);

        // if statement to determine if long
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
