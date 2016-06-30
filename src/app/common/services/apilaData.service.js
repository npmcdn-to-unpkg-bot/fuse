(function() {

    angular
        .module('app.core')
        .service('apilaData', apilaData);

    apilaData.$inject = ['$http', 'authentication'];

    function apilaData($http, authentication) {

        ////////////////////////////////////////////////

        var apiUrl="http://localhost:3300";

       var authHeader = {
         "headers": {
             Authorization: 'Bearer ' + authentication.getToken()
         }
       };

        var getApiUrl = function() {
          return apiUrl;
        }

        ///////////////////////////////////////////////

        /***************** ISSUES RESOURCES ***************/

        var issuesList = function(status, communityid) {
            return $http.get(apiUrl + '/api/issues/list/' + status + "/id/" + communityid
            , authHeader);
        };

        var issueById = function(issueid) {
            return $http.get(apiUrl + '/api/issues/' + issueid, authHeader);
        };

        var listIssueByUsername = function(username, status, communityid) {
          return $http.get(apiUrl + '/api/issues/' + username + "/s/" + status +
           "/id/" + communityid, authHeader);
        }

        var addIssue = function(data) {
            return $http.post(apiUrl + '/api/issues/new', data, authHeader);
        }

        var updateIssue = function(issueid, data) {
            return $http.put(apiUrl + '/api/issues/' + issueid, data, authHeader);
        }

        var deleteIssueLabelById = function(issueid, labelid) {
          return $http.delete(apiUrl + '/api/issues/' + issueid + '/labels/' + labelid, authHeader);
        }

        var updateIssueLabelById = function(issueId, labelid, data) {
          return $http.put(apiUrl + '/api/issues/' + issueId + '/labels/' + labelid, data, authHeader);
        }

        var addIssueCommentById = function(issueid, data) {
            return $http.post(apiUrl + '/api/issues/' + issueid + '/comments/new', data, authHeader);
        };

        var addIssueLabelById = function(issueid, data) {
            return $http.post(apiUrl + '/api/issues/' + issueid + '/labels/new', data, authHeader);
        };

        var addCheckList = function(issueid, data) {
          return $http.post(apiUrl + '/api/issues/'+ issueid + '/checklists/new', data, authHeader);
        }

        var updateCheckList = function(issueid, checklistid, data) {
            return $http.put(apiUrl + '/api/issues/' + issueid + '/checklists/' + checklistid,
                data, authHeader);

        };

        var deleteCheckList = function(issueid, checklistid) {
          return $http.delete(apiUrl + '/api/issues/' + issueid + '/checklists/' + checklistid, authHeader);
        }

        var deleteAttachment = function(issueid, attachmentid, data) {
          return $http.delete(apiUrl + '/api/issues/' + issueid + '/attachments/' + attachmentid, authHeader);
        }

        var updateIssue = function(issueid, data) {
          return $http.put(apiUrl + '/api/issues/' + issueid, data, authHeader);
        }

        var openIssuesCount = function(username, communityId) {
          return $http.get(apiUrl + '/api/issues/count/' + username + '/id/'
           + communityId, authHeader);
        }

        var deleteIssue = function(issueid) {
          return $http.delete(apiUrl + '/api/issues/' + issueid, authHeader);
        }

        var issuesCount = function(communityId) {
          return $http.get(apiUrl + '/api/issues/issuescount/' + communityId, authHeader);
        }


        /***************** APPOINTMENTS RESOURCES ***************/

        var appointmentsList = function(communityid) {
            return $http.get(apiUrl + '/api/appointments/' + communityid, authHeader);
        };

        var appointmentsListByMonth = function(month) {
            return $http.get(apiUrl + '/api/appointments/' +  month, authHeader);
        };


        var appointmentById = function(appointmentid) {
            return $http.get(apiUrl + '/api/appointments/' + appointmentid, authHeader);
        };

        var addAppointment = function(data) {
            return $http.post(apiUrl + '/api/appointments/new', data, authHeader);
        }

        var updateAppointment = function(appointmentid, formData) {
            return $http.put(apiUrl + '/api/appointments/update/' + appointmentid,
                formData, authHeader);

        };

        var addAppointmentCommentById = function(appointmentid, data) {
            return $http.post(apiUrl + '/api/appointments/' + appointmentid + '/comments/', data, authHeader);
        };

        var appointmentsToday = function(communityId) {
          return $http.get(apiUrl + '/api/appointments/today/' + communityId, authHeader);
        }

        /*********************************************************/

        /***************** RESIDENTS RESOURCES ******************/

        var residentsList = function(communityId) {
            return $http.get(apiUrl + '/api/residents/list/' + communityId, authHeader);
        };

        var addResident = function(data) {
            return $http.post(apiUrl + '/api/residents/new', data, authHeader);
        };

        var residentById = function(residentid) {
            return $http.get(apiUrl + '/api/residents/' + residentid, authHeader);
        };

        var updateResident = function(residentid, formData) {
            return $http.put(apiUrl + '/api/residents/update/' + residentid,
                formData, authHeader);

        };

        var residentCount = function(communityid) {
            return $http.get(apiUrl + '/api/residents/count/' + communityid, authHeader);
        };

        /**************************************************************/

        /***************** USERS RESOURCES ***************/

        var usersList = function() {
          return $http.get(apiUrl + '/api/users', authHeader);
        }

        var userCommunity = function(username) {
          return $http.get(apiUrl + '/api/users/community/' + username, authHeader);
        }

        var forgotPassword = function(email) {
          return $http.post(apiUrl + '/api/users/forgotpassowrd/' + email);
        }

        var resetPassword = function(token, data) {
          return $http.post(apiUrl + '/api/users/reset/' + token, data);
        }


        /***************** COMMUNITY RESOURCES ***************/

        var addCommunity = function(data) {
          return $http.post(apiUrl + '/api/communities/new', data);
        }

        var communityList = function(data) {
          return $http.get(apiUrl + '/api/communities/', authHeader);
        }

        var acceptMember = function(data, communityid) {
          return $http.put(apiUrl + '/api/communities/accept/' + communityid, data, authHeader);
        }

        var addPendingMember = function(data, communityid) {
          return $http.put(apiUrl + '/api/communities/pending/' + communityid, data, authHeader);
        }

        var declineMember = function(data, communityid) {
          return $http.put(apiUrl + '/api/communities/decline/' + communityid, data, authHeader);
        }

        return {
            //appointments
            appointmentsList : appointmentsList,
            appointmentById : appointmentById,
            addAppointment : addAppointment,
            updateAppointment : updateAppointment,
            addAppointmentCommentById : addAppointmentCommentById,
            appointmentsListByMonth: appointmentsListByMonth,
            appointmentsToday : appointmentsToday,

            //issues
            issuesList : issuesList,
            issueById : issueById,
            addIssue : addIssue,
            addIssueCommentById : addIssueCommentById,
            updateIssue : updateIssue,
            listIssueByUsername: listIssueByUsername,
            addIssueLabelById : addIssueLabelById,
            deleteIssueLabelById: deleteIssueLabelById,
            updateIssueLabelById: updateIssueLabelById,
            addCheckList : addCheckList,
            updateCheckList: updateCheckList,
            deleteCheckList: deleteCheckList,
            deleteAttachment: deleteAttachment,
            updateIssue: updateIssue,
            openIssuesCount : openIssuesCount,
            deleteIssue : deleteIssue,
            issuesCount : issuesCount,

            //residents
            residentsList : residentsList,
            addResident : addResident,
            residentById : residentById,
            updateResident: updateResident,
            residentCount : residentCount,

            //api url
            getApiUrl   : getApiUrl,

            //users
            usersList : usersList,
            userCommunity : userCommunity,
            forgotPassword : forgotPassword,
            resetPassword : resetPassword,

            //community
            addCommunity : addCommunity,
            communityList : communityList,
            acceptMember : acceptMember,
            addPendingMember : addPendingMember,
            declineMember : declineMember
        };
    }

})();
