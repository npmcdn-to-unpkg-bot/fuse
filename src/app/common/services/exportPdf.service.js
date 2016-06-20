// jsPDF documentation: https://parall.ax/products/jspdf

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

      // date config
      var residentBirthDate = new Date(data.birthDate);
      var residentAdmissionDate = new Date(data.admissionDate);
      var dateFilter = $filter('date');
      var residentFiltedBirthDate = dateFilter(residentBirthDate, 'MMM d, yyyy');
      var residentFiltedAdmissionDate = dateFilter(residentAdmissionDate, 'MMM d, yyyy');

      var arrayLengthOffset = 0;
      var adminOffset = 250;

      var logoPosX = 15,
        logoPosY = 15;
      var logoWidth = 130,
        logoHeight = 55;

      // doc.addImage(imageData.getApilaLogo(), 'JPEG', logoPosX, logoPosY, logoPosX + logoWidth, logoPosY + logoHeight);

      /* rounded box attempt
      doc.text(200, 80, data.communityName + " - Care Plan");

      doc.setFontSize(10);
      doc.text(200, 30, "3407 Carroll St");
      doc.text(200, 42, "Alamosa CO, 81101");
      doc.text(200, 54, "AlamosaBridge.com");

      doc.text(350, 30, "Phone:");
      doc.text(350, 42, "Fax:");
      doc.text(350, 54, "Clinical Services Fax:");

      doc.text(450, 30, "(719) 587-3514");
      doc.text(450, 42, "(719) 589-3614");
      doc.text(450, 54, "(719) 589-7424");

      doc.roundedRect(30, 90, 550, 200, 7, 7);
      doc.text(35, 102, "Name: " + data.firstName + " " + data.middleName + " " + data.lastName);
      doc.text(35, 114, "Maiden Name: " + data.maidenName);
      */

      // font setup
      doc.setFontSize(10);
      doc.setTextColor(33,33,33);
      doc.setFont("courier");
      doc.setFontType("bold");
      doc.setLineWidth(25);

      // address line
      doc.setDrawColor(236,239,241);
      doc.line(0, 25, 650, 25);
      doc.text(14, 28, "ADDRESS");
      doc.text(300, 28, "3407 Carroll St Alamosa CO, 81101");

      // phone line
      doc.setDrawColor(207,216,220);
      doc.line(0, 50, 650, 50);
      doc.text(25, 53, "PHONE");
      doc.text(300, 53, "(719) 587-3514");

      // fax line
      doc.setDrawColor(176,190,197);
      doc.line(0, 75, 650, 75);
      doc.text(36, 78, "FAX");
      doc.text(300, 78, "(719) 589-3614");

      // web line
      doc.setDrawColor(144,164,174);
      doc.line(0, 100, 650, 100);
      doc.text(37, 103, "WEB");
      doc.text(300, 103, "AlamosaBridge.com");

      // allergy
      doc.setDrawColor(0,150,136);
      doc.line(0, 150, 650, 150);
      doc.text(300, 153, "ALLERGY");

      if (data.hasFoodAllergies === true || data.hasMedicationAllergies === true){

        arrayLengthOffset = 174;

        if (data.hasFoodAllergies === true) {
          doc.text(295, arrayLengthOffset, "Food Allergies:");
          doc.text(430, arrayLengthOffset, data.foodAllergies);
          arrayLengthOffset = (data.foodAllergies.length * 12) + arrayLengthOffset;
        }

        if (data.hasMedicationAllergies === true) {
          doc.text(295, arrayLengthOffset, "Medication Allergies:");
          doc.text(430, arrayLengthOffset, data.medicationAllergies);
          arrayLengthOffset = (data.medicationAllergies.length * 12) + arrayLengthOffset;
        }

        arrayLengthOffset = arrayLengthOffset + 25;

      } else {
        doc.text(295, 174, data.firstName + " has no known allergies");
        arrayLengthOffset = 174 + 35;
      }

      // bathing line
      doc.setDrawColor(3,169,244);
      doc.line(0, arrayLengthOffset, 650, arrayLengthOffset);
      doc.text(300, arrayLengthOffset + 3, "BATHING");

      doc.text(295, arrayLengthOffset + 24, "Type:");
      doc.text(430, arrayLengthOffset + 24, data.typeOfBathing + " ");

      doc.text(295, arrayLengthOffset + 36, "Time:");
      doc.text(430, arrayLengthOffset + 36, data.timeOfBathing + " ");

      doc.text(295, arrayLengthOffset + 48, "Frequency:");
      doc.text(430, arrayLengthOffset + 48, data.frequencyOfBathing + " ");

      arrayLengthOffset = arrayLengthOffset + 60;

      doc.text(295, arrayLengthOffset, "Acceptance:");
      doc.text(430, arrayLengthOffset, data.acceptanceOfBathing + " ");

      if (data.acceptanceOfBathing == "Dislikes") {
        doc.text(295, arrayLengthOffset + 12, "Why Dislikes:");
        doc.text(430, arrayLengthOffset + 12, data.dislikesBathingDescribe + " ");
        arrayLengthOffset = arrayLengthOffset + 12;
      }

      // continent line
      doc.setDrawColor(121,85,72);
      doc.line(0, arrayLengthOffset + 38, 650, arrayLengthOffset + 38);
      doc.text(300, arrayLengthOffset + 41, "CONTINENT");

      doc.text(295, arrayLengthOffset + 62, "Bowel Continent:");
      doc.text(430, arrayLengthOffset + 62, data.bowelContinent + " ");

      doc.text(295, arrayLengthOffset + 74, "Constipated:");
      doc.text(430, arrayLengthOffset + 74, data.constipated + " ");

      doc.text(295, arrayLengthOffset + 86, "Laxative:");
      doc.text(430, arrayLengthOffset + 86, data.laxative + " ");

      doc.text(295, arrayLengthOffset + 110, "Bladder Continent:");
      doc.text(430, arrayLengthOffset + 110, data.bladderContinent + " ");

      doc.text(295, arrayLengthOffset + 122, "Dribbles:");
      doc.text(430, arrayLengthOffset + 122, data.dribbles + " ");

      if (data.catheter == true) {
        doc.text(295, arrayLengthOffset + 134, "Catheter Description:");
        doc.text(430, arrayLengthOffset + 134, data.catheterDescribe + " ");
        arrayLengthOffset = arrayLengthOffset + 12;
      }

      arrayLengthOffset = arrayLengthOffset + 134;

      doc.text(295, arrayLengthOffset, "Toileting Device:");
      doc.text(430, arrayLengthOffset, data.toiletingDevice + " ");

      // mobility line
      doc.setDrawColor(255,235,59);
      doc.line(0, arrayLengthOffset + 38, 650, arrayLengthOffset + 38);
      doc.text(300, arrayLengthOffset + 41, "MOBILITY");

      doc.text(295, arrayLengthOffset + 62, "Inside Apartment:");
      doc.text(295, arrayLengthOffset + 74, "Use of Assistive Device:");
      doc.text(450, arrayLengthOffset + 74, data.toiletingDevice + " ");

      doc.text(295, arrayLengthOffset + 86, "Assitance with Device:");
      doc.text(450, arrayLengthOffset + 86, data.toiletingDevice + " ");

      doc.text(295, arrayLengthOffset + 98, "Special Ambulation Needs:");
      doc.text(450, arrayLengthOffset + 98, data.toiletingDevice + " ");

      doc.text(295, arrayLengthOffset + 122, "Outside Apartment:");
      doc.text(295, arrayLengthOffset + 134, "Use of Assistive Device:");
      doc.text(450, arrayLengthOffset + 134, data.toiletingDevice + " ");

      doc.text(295, arrayLengthOffset + 146, "Assitance with Device:");
      doc.text(450, arrayLengthOffset + 146, data.toiletingDevice + " ");

      doc.text(295, arrayLengthOffset + 158, "Special Ambulation Needs:");
      doc.text(450, arrayLengthOffset + 158, data.toiletingDevice + " ");

      doc.text(295, arrayLengthOffset + 182, "Transfers:");
      doc.text(450, arrayLengthOffset + 182, data.transfers + " ");

      if (data.fallRisk == true) {
        doc.text(295, arrayLengthOffset + 194, "Fall Risk Description:");
        doc.text(450, arrayLengthOffset + 194, data.fallRiskDescribe + " ");
        arrayLengthOffset = arrayLengthOffset + 12;
      }

      doc.text(295, arrayLengthOffset + 194, "Bed Reposition:");
      doc.text(450, arrayLengthOffset + 194, data.bedReposition + " ");

      arrayLengthOffset = arrayLengthOffset + 202

      doc.text(450, arrayLengthOffset, arrayLengthOffset + " ");

      // big vertical line
      doc.setDrawColor(120,144,156);
      doc.setLineWidth(220);
      doc.line(180, 0, 180, 800);

      // community title
      doc.setFontSize(16.6);
      doc.text(75, 40, data.communityName);

      // logo placeholder
      doc.setDrawColor(33,33,33);
      doc.setLineWidth(10);
      doc.triangle(
        180, 80, // (x,y) of point 1
        90, 200, // (x,y) of point 2
        270, 200, // (x,y) of point 3
        'FD');
      doc.setFontSize(10);
      doc.setTextColor(250,250,250);
      doc.text(130, 170, "transparent logo");

      // admin header
      doc.setTextColor(33,33,33);
      doc.setFontSize(16.6);
      doc.text(135, 220, "Care Plan");
      doc.text(164, 235, "for");
      doc.text(75, adminOffset, data.firstName);

      if (data.middleName !== "") {
        adminOffset = adminOffset + 15;
        doc.text(75, adminOffset, data.middleName);
      }

      doc.text(75, adminOffset + 15, data.lastName);

      // admin info
      doc.setFontSize(10);
      doc.text(99, adminOffset + 30, "Maiden Name: " + data.maidenName);
      doc.text(147, adminOffset + 42, "Sex: " + data.sex);
      doc.text(87, adminOffset + 54, "Date of Birth: " + residentFiltedBirthDate);
      doc.text(81, adminOffset + 66, "Admission Date: " + residentFiltedAdmissionDate);
      doc.text(75, adminOffset + 78, "Building Status: " + data.buildingStatus);

      doc.addPage();
      doc.setLineWidth(25);

      // nutrition line
      doc.setDrawColor(139,195,74);
      doc.line(0, 575, 650, 575);
      doc.text(300, 578, "NUTRITION");

      // pain line
      doc.setDrawColor(244,67,54);
      doc.line(0, 600, 650, 600);
      doc.text(300, 603, "PAIN");

      // physical condition line
      doc.setDrawColor(33,150,243);
      doc.line(0, 625, 650, 625);
      doc.text(300, 628, "PHYSICAL");

      // psychosocial line
      doc.setDrawColor(156,39,176);
      doc.line(0, 650, 650, 650);
      doc.text(300, 653, "PSYCHOSOCIAL");

      // sleep line
      doc.setDrawColor(233,30,99);
      doc.line(0, 675, 650, 675);
      doc.text(300, 678, "SLEEP");

      doc.text(295, arrayLengthOffset + 62, "Usual Bedtime:");
      doc.text(430, arrayLengthOffset + 62, data.usualBedtime + " ");

      doc.text(295, arrayLengthOffset + 74, "Usual Arising Time:");
      doc.text(430, arrayLengthOffset + 74, data.usualArisingTime + " ");

      if (data.nap == true) {
        doc.text(295, arrayLengthOffset + 86, "Nap Description:");
        doc.text(430, arrayLengthOffset + 86, data.napDescribe + " ");
        arrayLengthOffset = arrayLengthOffset + 12;
      }

      doc.text(295, arrayLengthOffset + 86, "Assistance to Bed:");
      doc.text(430, arrayLengthOffset + 86, data.assistanceToBed + " ");

      arrayLengthOffset = arrayLengthOffset + 98;

      doc.text(295, arrayLengthOffset, "Assistance to Bed:");
      doc.text(430, arrayLengthOffset, data.assistanceToBed + " ");

      if (data.sleepsThroughNight == true) {
        doc.text(295, arrayLengthOffset + 12, "Can Call for Assistance:");
        doc.text(430, arrayLengthOffset + 12, data.canCallForAssistance + " ");
        arrayLengthOffset = arrayLengthOffset + 12;
      }

      // vitals line
      doc.setDrawColor(205,220,57);
      doc.line(0, 700, 650, 700);
      doc.text(300, 703, "VITALS");


/* comment out graphs for now
      doc.text(50, 266, "Vitals");
      doc.setFontSize(10);

      doc.text(50, 305, "Temperature");
      doc.addImage(data.temperature, 'PNG', 50, 320,
        150, 150);

      doc.text(210, 305, "Blood Pressure ");
      doc.addImage(data.bloodCanvas, 'PNG', 250, 320,
        150, 150);

      doc.text(50, 490, "Oxygen Saturation");
      doc.addImage(data.oxygen, 'PNG', 50, 490,
        150, 150);

      doc.text(210, 490, "Pulse");
      doc.addImage(data.pulse, 'PNG', 250, 490,
        150, 150);

      doc.text(410, 490, "Vitals Pain");
      doc.addImage(data.vitals, 'PNG', 410, 490,
        150, 150);

      doc.text(50, 635, "Respiration");
      doc.addImage(data.resp, 'PNG', 50, 635,
        150, 150);
*/

      doc.save(fileName);
    }

    return {
      exportAppointments: exportAppointments,
      exportAppointmentDetail: exportAppointmentDetail,
      exportCarePlan: exportCarePlan
    };

  }

})();
