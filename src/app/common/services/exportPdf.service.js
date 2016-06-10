(function() {

  angular.module("app.core").service("exportPdf", exportPdf);


  exportPdf.$inject = ['$filter', 'imageData'];

  function exportPdf($filter, imageData) {

    //deprecated
    var exportAppointments = function(name, printable, header) {
      var doc = new jsPDF('p', 'pt', 'letter');

      // positions the table
      margins = {
        top: 120,
        bottom: 5,
        left: 40,
        width: 220
      };

      doc.fromHTML(printable, margins.left, margins.top, {
          "width": margins.width
        },
        function(dispose) {
          doc.setFontSize(18);
          doc.text(40, 50, "Apila Appointments");
          doc.text(40, 100, "Date: " + name);
          doc.save(name);
        }, margins);

    }

    var exportAppointmentDetail = function(name, data) {
      var doc = new jsPDF('p', 'pt', 'letter');

      doc.addImage(imageData.getApilaForm(), 'JPEG', 15, 15, 580, 760);

      var appointmentDate = new Date(data.date);

      appointmentDate.setHours(appointmentDate.getUTCHours());

      var commentLength = 90;

      var residentBirthDate = new Date(data.residentGoing.birthDate);

      var dateFilter = $filter('date');
      var appointmentFilteredTime = dateFilter(appointmentDate, 'h:mm a');
      var appointmentFilteredDate = dateFilter(appointmentDate, 'MMM d, yyyy');
      var residentFiltedBirthDate = dateFilter(residentBirthDate, 'MMM d, yyyy');

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
      doc.text(490, 156, residentFiltedBirthDate);

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

    function exportCarePlan(data) {

      var doc = new jsPDF('p', 'pt', 'letter');
      var fileName = data.firstName + ' ' + data.lastName + '.pdf';

      var logoPosX = 25, logoPosY = 25;
      var logoWidth = 205, logoHeight = 100;

      doc.addImage(imageData.getApilaLogo(), 'JPEG', logoPosX, logoPosY,
                  logoPosX + logoWidth, logoPosY + logoHeight);

      doc.text(50, 186, data.communityName);
      doc.text(50, 226, "Resident : " + data.firstName + " " + data.lastName);

      doc.text(50, 266, "Vitals");

      doc.setFontSize(10);

      doc.text(50, 305, "Temperature");
      doc.addImage(data.temperature, 'PNG', 50 , 320,
                    150, 150);

      doc.text(210, 305, "Blood Pressure Systolic");
      doc.addImage(data.bloodSys, 'PNG', 250 , 320,
                    150, 150);

      doc.text(410, 305, "Blood Pressure Diastolic");
      doc.addImage(data.bloodDias, 'PNG', 410 , 320,
                    150, 150);

      doc.text(50, 490, "Oxygen Saturation");
      doc.addImage(data.oxygen, 'PNG', 50 , 490,
                    150, 150);

      doc.text(210, 490, "Pulse");
      doc.addImage(data.pulse, 'PNG', 250 , 490,
                    150, 150);

      doc.text(410, 490, "Vitals Pain");
      doc.addImage(data.vitals, 'PNG', 410 , 490,
                    150, 150);

      doc.text(50, 635, "Respiration");
      doc.addImage(data.resp, 'PNG', 50 , 635,
                    150, 150);

      doc.save(fileName);
    }

    return {
      exportAppointments: exportAppointments,
      exportAppointmentDetail: exportAppointmentDetail,
      exportCarePlan : exportCarePlan
    };

  }

})();
