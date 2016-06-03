(function ()
{
    'use strict';

    angular
        .module('app.appointments')
        .controller('AppoitmentsController', AppoitmentsController);

    /** @ngInject */
    function AppoitmentsController($mdDialog, $document, apilaData, msNavigationService, authentication, exportPdf, $state)
    {
        var vm = this;

        // Data
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        var appointments = null;

        var username = authentication.currentUser().name;

        function openIssuesCount(id)
        {
          apilaData.openIssuesCount(username, id)
            .success(function(count) {
              msNavigationService.saveItem('fuse.issues', {
                badge: {
                  content:  count,
                  color  : '#F44336'
                }
              });
            })
            .error(function(count) {
            });
        }


          apilaData.userCommunity(username)
            .success(function(d) {
              vm.community = d;
              loadAppoitnments(vm.community._id);
              openIssuesCount(vm.community._id);
            });

      var loadAppoitnments = function(id) {

        var appointList = [];

        //load all the events and show them on the callendar
        apilaData.appointmentsList(id)
               .success(function(data) {
                 appointments = data;
                 var i = 1;
                   angular.forEach(data, function(value, key) {

                     var dateObj = new Date(value.time);

                     var timeSwitch = false;
                     var hours = dateObj.getHours();

                     if(dateObj.getHours() > 12) {
                       timeSwitch = true;
                       hours -= 12;
                     }

                     var calEvent = {
                       id: i,
                       title: value.residentGoing.firstName + " " + value.residentGoing.lastName +
                       " going to " + value.locationName,
                       start: value.time,
                       end: null,
                       transportation: value.transportation,
                       reason: value.reason,
                       dayTimeSwitch: timeSwitch,
                       minutes: dateObj.getMinutes(),
                       hours: hours,
                       locationDoctor: value.locationDoctor,
                       locationName: value.locationName,
                       date: value.time,
                       currentUser: value.residentGoing,
                       appointId: value._id,
                       cancel: value.cancel,
                       appointmentComment: value.appointmentComment,
                       residentGoing: value.residentGoing,
                       stick: true
                     }

                     if(value.cancel === true) {
                       calEvent.color = "#f24438";
                     }

                     i++;

                     appointList.push(calEvent);

                   });

                   vm.events[0] = appointList;

               })
               .error(function(e) {
                   console.log("error loading appointments");
               });




             };


        vm.events = [[]];

        vm.calendarUiConfig = {
            calendar: {
                editable          : true,
                eventLimit        : false,
                header            : '',
                handleWindowResize: false,
                aspectRatio       : 1,
                dayNames          : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                dayNamesShort     : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                viewRender        : function (view)
                {


                    vm.calendarView = view;
                    vm.calendar = vm.calendarView.calendar;
                    vm.currentMonthShort = vm.calendar.getDate().format('MMM');



                },
                columnFormat      : {
                    month: 'ddd',
                    week : 'ddd D',
                    day  : 'ddd M'
                },
                eventClick        : eventDetail,
                selectable        : true,
                selectHelper      : true,
                select            : select
            }
        };

        // Methods
        vm.addEvent = addEvent;
        vm.next = next;
        vm.prev = prev;
        vm.exportAppointments = exportAppointments;

        //////////

        function exportAppointments() {
          var columns = ["Resident", "Date", "Reason", "Location", "Doctor", "Transportation"];

          var month = vm.calendar.getDate().format("MMM");

          var sortedEvents = _.sortBy(vm.events[0], function(p) {
            return p.date;
          });

          var rows = _.map(_.filter(sortedEvents, function(o) {
            return moment(o.start).format("MM") === vm.calendar.getDate().format("MM")
                  && o.cancel === false;
          }), function(d){
              var arr = [];

              var name = "";
              if(d.residentGoing !=  null) {
                name = d.residentGoing.firstName + " " + d.residentGoing.lastName;
              }

              console.log(d.date);
              console.log(moment.utc(d.date).format("MM/DD hh:mm A"));

              arr.push(name);
              arr.push(moment.utc(d.date).format("MM/DD hh:mm A"));
              arr.push(d.reason);
              arr.push(d.locationName);
              arr.push(d.locationDoctor);
              arr.push(d.transportation);

              return arr;
          });

          var doc = new jsPDF('p', 'pt');
          doc.autoTable(columns, rows, {
            beforePageContent: function(data) {
              doc.text(" - Appointments for month " + month + " -", 160, 30);
          }
          });
          doc.save('apila-' + month + '-appointments.pdf');
        }

        /**
         * Go to next on current view (week, month etc.)
         */
        function next()
        {
            vm.calendarView.calendar.next();

        }

        /**
         * Go to previous on current view (week, month etc.)
         */
        function prev()
        {
            vm.calendarView.calendar.prev();
        }

        /**
         * Show event detail
         *
         * @param calendarEvent
         * @param e
         */
        function eventDetail(calendarEvent, e)
        {
            showEventDetailDialog(calendarEvent, e);
        }

        /**
         * Add new event in between selected dates
         *
         * @param start
         * @param end
         * @param e
         */
        function select(start, end, e)
        {
            showEventFormDialog('add', false, start, end, e);
        }

        /**
         * Add event
         *
         * @param e
         */
        function addEvent(e)
        {
            var start = new Date().getUTCDate(),
                end = new Date();

            showEventFormDialog('add', false, start, end, e);
        }

        /**
         * Show event detail dialog
         * @param calendarEvent
         * @param e
         */
        function showEventDetailDialog(calendarEvent, e)
        {
            $mdDialog.show({
                controller         : 'EventDetailDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/appointments/dialogs/event-detail/event-detail-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: true,
                locals             : {
                    calendarEvent      : calendarEvent,
                    showEventFormDialog: showEventFormDialog,
                    event              : e
                }
            });
        }

        /**
         * Show event add/edit form dialog
         *
         * @param type
         * @param calendarEvent
         * @param start
         * @param end
         * @param e
         */
        function showEventFormDialog(type, calendarEvent, start, end, e)
        {
            var dialogData = {
                type         : type,
                calendarEvent: calendarEvent,
                start        : start,
                end          : end
            };

            $mdDialog.show({
                controller         : 'EventFormDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/appointments/dialogs/event-form/event-form-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: true,
                locals             : {
                    dialogData: dialogData
                }
            }).then(function (response)
            {

              var dateObj = new Date(response.calendarEvent.time);

              var timeSwitch = false;
              var hours = dateObj.getUTCHours();

              if(dateObj.getUTCHours() > 12) {
                timeSwitch = true;
                hours -= 12;
              }

              var resident = response.calendarEvent.residentGoing;

              var formatTitle = resident.firstName + " " + resident.lastName +
              " going to " + response.calendarEvent.locationName;

                if ( response.type === 'add' )
                {
                    // Add new
                    vm.events[0].push({
                        id   : vm.events[0].length + 80,
                        title: formatTitle,
                        start: response.calendarEvent.time,
                        end  : null,
                        transportation: response.calendarEvent.transportation,
                        reason: response.calendarEvent.reason,
                        dayTimeSwitch: timeSwitch,
                        minutes: dateObj.getMinutes(),
                        hours: hours,
                        locationDoctor: response.calendarEvent.locationDoctor,
                        locationName: response.calendarEvent.locationName,
                        date: response.calendarEvent.time,
                        currentUser: response.calendarEvent.residentGoing,
                        appointId: response.calendarEvent.appointId,
                        cancel: response.calendarEvent.cancel,
                        appointmentComment: response.calendarEvent.appointmentComment,
                        residentGoing: response.calendarEvent.residentGoing,
                        stick: true

                    });
                }
                else
                {

                    for ( var i = 0; i < vm.events[0].length; i++ )
                    {
                        // Update
                        if ( vm.events[0][i]._id === response.calendarEvent.calId )
                        {
                          console.log("Updejtovo");

                            var currEvent = {
                              title: response.title,
                              start: response.calendarEvent.time,
                              end  : null,
                              transportation: response.calendarEvent.transportation,
                              reason: response.calendarEvent.reason,
                              dayTimeSwitch: timeSwitch,
                              minutes: dateObj.getMinutes(),
                              hours: hours,
                              locationDoctor: response.calendarEvent.locationDoctor,
                              locationName: response.calendarEvent.locationName,
                              date: response.calendarEvent.time,
                              currentUser: response.calendarEvent.currentUser,
                              appointId: response.calendarEvent.appointId,
                              cancel: response.calendarEvent.cancel,
                              appointmentComment: response.calendarEvent.appointmentComment,
                              residentGoing: response.calendarEvent.residentGoing,
                              stick: true
                            };

                            if(currEvent.cancel === true) {
                              currEvent.color = "#f00";
                            }

                            vm.events[0][i] = currEvent;

                            break;
                        }
                    }
                }
            });
        }

    }

})();
