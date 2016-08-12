(function() {
  angular.module("app.core").service("exportAppointDetail", exportAppointDetail);

  exportAppointDetail.$inject = ['$filter', 'imageData'];

  function exportAppointDetail($filter, imageData) {

    function exportPdf(name, data) {
      var doc = new jsPDF('p', 'pt', 'letter');

      doc.addImage(imageData.getImage('apila_form'), 'JPEG', 15, 15, 580, 760);

      var appointmentDate = new Date(data._start);

      appointmentDate.setHours(data.hours);
      appointmentDate.setMinutes(data.minutes);

      var commentLength = 90;

      var residentBirthDate = new Date(data.residentGoing.birthDate);

      var dateFilter = $filter('date');
      var appointmentFilteredTime = dateFilter(appointmentDate, 'h:mm a');
      var appointmentFilteredDate = dateFilter(appointmentDate, 'MMM d, yyyy');
      var residentFilteredBirthDate = dateFilter(residentBirthDate, 'MMM d, yyyy');

      doc.setFont("times");
      doc.setFontSize(12);
      doc.text(50, 156, "Resident Going:");
      doc.text(140, 156, data.residentGoing.firstName + " " + data.residentGoing.lastName);
      doc.text(50, 173, "Reason:");
      doc.text(140, 173, data.reason);

      doc.text(50, 204, "Location:");
      doc.text(140, 204, data.locationName);
      doc.text(50, 221, "Doctor:");
      doc.text(140, 221, data.locationDoctor);
      doc.text(50, 238, "Transporting:");
      doc.text(140, 238, data.transportation);

      doc.text(415, 156, "Date of Birth:");
      doc.text(490, 156, residentFilteredBirthDate);

      doc.text(415, 204, "Appointment");
      doc.text(415, 221, "Date:");
      doc.text(490, 221, appointmentFilteredDate);
      doc.text(415, 238, "Time:");
      doc.text(490, 238, appointmentFilteredTime);

      var leftofPoint = 0;

      //grab all the comments
      for (var i = 0; i < data.appointmentComment.length; ++i) {
        var comment = data.appointmentComment[i];

        doc.text(50, 310 + i * 35 + leftofPoint, "Author: " + comment.author);

        if (comment.commentText.length > commentLength) {
          var numTimes = Math.floor(comment.commentText.length / commentLength);

          for (var j = 0; j < numTimes; ++j) {
            var txt = "";
            if (j === 0) {
              txt = "Text: ";
            }
            doc.text(50, 325 + i * 35 + j * 15 + leftofPoint, txt + comment.commentText.substr(j * (commentLength), commentLength));
          }
          leftofPoint = numTimes * 15;
        } else {
          doc.text(50, 325 + i * 35 + leftofPoint, "Text: " + comment.commentText);
        }
      }
      doc.save(name);
    }

    return {
      exportPdf : exportPdf
    };

  }

})();
