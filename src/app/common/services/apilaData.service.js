(function() {

    angular
        .module('app.core')
        .service('apilaData', apilaData);

    apilaData.$inject = ['$http', 'authentication'];

    function apilaData($http, authentication) {

        ////////////////////////////////////////////////

        var apiUrl="http://localhost:3300";

        function getAuth() {
          return {
            "headers": {
                Authorization: 'Bearer ' + authentication.getToken()
            }
          };
        }


        var getApiUrl = function() {
          return apiUrl;
        }

        ///////////////////////////////////////////////

        /***************** ISSUES RESOURCES ***************/

        var issuesList = function(status, communityid) {
            return $http.get(apiUrl + '/api/issues/list/' + status + "/id/" + communityid
            , getAuth());
        };

        var issueById = function(issueid) {
            return $http.get(apiUrl + '/api/issues/' + issueid, getAuth());
        };

        var listIssueByUsername = function(username, status, communityid) {
          return $http.get(apiUrl + '/api/issues/' + username + "/s/" + status +
           "/id/" + communityid, getAuth());
        }

        var addIssue = function(data) {
            return $http.post(apiUrl + '/api/issues/new', data, getAuth());
        }

        var updateIssue = function(issueid, data) {
            return $http.put(apiUrl + '/api/issues/' + issueid, data, getAuth());
        }

        var deleteIssueLabelById = function(issueid, labelid) {
          return $http.delete(apiUrl + '/api/issues/' + issueid + '/labels/' + labelid, getAuth());
        }

        var updateIssueLabelById = function(issueId, labelid, data) {
          return $http.put(apiUrl + '/api/issues/' + issueId + '/labels/' + labelid, data, getAuth());
        }

        var addIssueCommentById = function(issueid, data) {
            return $http.post(apiUrl + '/api/issues/' + issueid + '/comments/new', data, getAuth());
        };

        var addIssueLabelById = function(issueid, data) {
            return $http.post(apiUrl + '/api/issues/' + issueid + '/labels/new', data, getAuth());
        };

        var addCheckList = function(issueid, data) {
          return $http.post(apiUrl + '/api/issues/'+ issueid + '/checklists/new', data, getAuth());
        }

        var updateCheckList = function(issueid, checklistid, data) {
            return $http.put(apiUrl + '/api/issues/' + issueid + '/checklists/' + checklistid,
                data, getAuth());

        };

        var deleteCheckList = function(issueid, checklistid) {
          return $http.delete(apiUrl + '/api/issues/' + issueid + '/checklists/' + checklistid, getAuth());
        }

        var deleteAttachment = function(issueid, attachmentid, data) {
          return $http.delete(apiUrl + '/api/issues/' + issueid + '/attachments/' + attachmentid, getAuth());
        }

        var updateIssue = function(issueid, data) {
          return $http.put(apiUrl + '/api/issues/' + issueid, data, getAuth());
        }

        var openIssuesCount = function(username, communityId) {
          return $http.get(apiUrl + '/api/issues/count/' + username + '/id/'
           + communityId, getAuth());
        }

        var deleteIssue = function(issueid) {
          return $http.delete(apiUrl + '/api/issues/' + issueid, getAuth());
        }

        var issuesCount = function(communityId) {
          return $http.get(apiUrl + '/api/issues/issuescount/' + communityId, getAuth());
        }

        var dueIssuesList = function(communityId) {
          return $http.get(apiUrl + '/api/issues/due/' + communityId, getAuth());
        }

        var createIssueRecovery = function(data, communityid) {
          return $http.post(apiUrl + '/api/issues/recovery/' + communityid, data, getAuth());
        }

        var verifyPassword = function(data, userid) {
          return $http.post(apiUrl + '/api/issues/recovery/verify/' + userid, data, getAuth());
        }

        /***************** APPOINTMENTS RESOURCES ***************/

        var appointmentsList = function(communityid) {
            return $http.get(apiUrl + '/api/appointments/' + communityid, getAuth());
        };

        var appointmentsListByMonth = function(month) {
            return $http.get(apiUrl + '/api/appointments/' +  month, getAuth());
        };


        var appointmentById = function(appointmentid) {
            return $http.get(apiUrl + '/api/appointments/' + appointmentid, getAuth());
        };

        var addAppointment = function(data) {
            return $http.post(apiUrl + '/api/appointments/new', data, getAuth());
        }

        var updateAppointment = function(appointmentid, formData) {
            return $http.put(apiUrl + '/api/appointments/update/' + appointmentid,
                formData, getAuth());

        };

        var addAppointmentCommentById = function(appointmentid, data) {
            return $http.post(apiUrl + '/api/appointments/' + appointmentid + '/comments/', data, getAuth());
        };

        var appointmentsToday = function(communityId) {
          return $http.get(apiUrl + '/api/appointments/today/' + communityId, getAuth());
        }

        /*********************************************************/

        /***************** RESIDENTS RESOURCES ******************/

        var residentsList = function(communityId) {
            return $http.get(apiUrl + '/api/residents/list/' + communityId, getAuth());
        };

        var addResident = function(data) {
            return $http.post(apiUrl + '/api/residents/new', data, getAuth());
        };

        var residentById = function(residentid) {
            return $http.get(apiUrl + '/api/residents/' + residentid, getAuth());
        };

        var updateResident = function(residentid, formData) {
            return $http.put(apiUrl + '/api/residents/update/' + residentid,
                formData, getAuth());

        };

        var residentBirthday = function(communityId) {
          return $http.get(apiUrl + "/api/residents/birthday/" + communityId, getAuth());
        }

        var residentCount = function(communityid) {
            return $http.get(apiUrl + '/api/residents/count/' + communityid, getAuth());
        };

        var averageAge = function(communityid) {
          return $http.get(apiUrl + '/api/residents/average_age/' + communityid, getAuth());
        }

        var averageStayTime = function(communityid) {
          return $http.get(apiUrl + '/api/residents/average_stay/' + communityid, getAuth());
        }

        /**************************************************************/

        /***************** USERS RESOURCES ***************/

        var usersList = function() {
          return $http.get(apiUrl + '/api/users', getAuth());
        }

        var changeUsername = function(username, data) {
          return $http.put(apiUrl + "/api/users/change/" + username, data, getAuth());
        }

        var usersInCommunity = function(communityId) {
          return $http.get(apiUrl + '/api/users/list/' + communityId, getAuth());
        }

        var userCommunity = function(username) {
          return $http.get(apiUrl + '/api/users/community/' + username, getAuth());
        }

        var forgotPassword = function(email) {
          return $http.post(apiUrl + '/api/users/forgotpassowrd/' + email);
        }

        var resetPassword = function(token, data) {
          return $http.post(apiUrl + '/api/users/reset/' + token, data);
        }

        var userImageUpload = function(username, data) {
          return $http.put(apiUrl + '/api/users/' + username + "/upload", data, getAuth());
        }

        var getUser = function(username) {
          return $http.get(apiUrl + '/api/users/getuser/' + username, getAuth());
        }

        var saveCreditCard = function(userid, data) {
          return $http.post(apiUrl + '/api/users/' + userid + '/savecard', data, getAuth());
        }

        var getCustomer = function(userid) {
          return $http.get(apiUrl + '/api/users/' + userid + "/customer", getAuth());
        }

        var cancelSubscription = function(userid) {
          return $http.delete(apiUrl + '/api/users/' + userid + '/subscription', getAuth());
        }

        var updateCustomer = function(userid, data) {
          return $http.put(apiUrl + '/api/users/' + userid + '/update', data, getAuth());
        }

        /***************** COMMUNITY RESOURCES ***************/

        var addCommunity = function(data) {
          return $http.post(apiUrl + '/api/communities/new', data);
        }

        var communityList = function(data) {
          return $http.get(apiUrl + '/api/communities/', getAuth());
        }

        var acceptMember = function(data, communityid) {
          return $http.put(apiUrl + '/api/communities/accept/' + communityid, data, getAuth());
        }

        var addPendingMember = function(data, communityid) {
          return $http.put(apiUrl + '/api/communities/pending/' + communityid, data, getAuth());
        }

        var declineMember = function(data, communityid) {
          return $http.put(apiUrl + '/api/communities/decline/' + communityid, data, getAuth());
        }

        var addRole = function(communityid, userid, data) {
          return $http.post(apiUrl + '/api/communites/' + communityid + "/role/" + userid, data, getAuth());
        }

        var removeMember = function(communityid, userid, submitby) {
          return $http.delete(apiUrl + '/api/communites/' + communityid + "/user/" + userid + "/submitby/" + submitby, getAuth());
        }

        var hasCanceledCommunity = function(userid) {
          return $http.get(apiUrl + '/api/communites/canceled/' + userid, getAuth());
        }

        var restoreCommunity = function(userid, communityid) {
          return $http.post(apiUrl + '/api/communites/' + communityid + '/restore/' + userid, {}, getAuth());
        }

        return {
            //appointments
            appointmentsList : appointmentsList,
            appointmentById : appointmentById,
            addAppointment : addAppointment,
            updateAppointment : updateAppointment,
            addAppointmentCommentById : addAppointmentCommentById,
            appointmentsListByMonth : appointmentsListByMonth,
            appointmentsToday : appointmentsToday,

            //issues
            issuesList : issuesList,
            issueById : issueById,
            addIssue : addIssue,
            addIssueCommentById : addIssueCommentById,
            updateIssue : updateIssue,
            listIssueByUsername: listIssueByUsername,
            addIssueLabelById : addIssueLabelById,
            deleteIssueLabelById : deleteIssueLabelById,
            updateIssueLabelById : updateIssueLabelById,
            addCheckList : addCheckList,
            updateCheckList : updateCheckList,
            deleteCheckList : deleteCheckList,
            deleteAttachment : deleteAttachment,
            updateIssue: updateIssue,
            openIssuesCount : openIssuesCount,
            deleteIssue : deleteIssue,
            issuesCount : issuesCount,
            dueIssuesList : dueIssuesList,
            createIssueRecovery : createIssueRecovery,
            verifyPassword : verifyPassword,

            //residents
            residentsList : residentsList,
            addResident : addResident,
            residentById : residentById,
            updateResident: updateResident,
            residentCount : residentCount,
            residentBirthday : residentBirthday,
            averageAge : averageAge,
            averageStayTime : averageStayTime,

            //api url
            getApiUrl : getApiUrl,

            //users
            usersList : usersList,
            changeUsername : changeUsername,
            usersInCommunity: usersInCommunity,
            userCommunity : userCommunity,
            forgotPassword : forgotPassword,
            resetPassword : resetPassword,
            userImageUpload : userImageUpload,
            getUser : getUser,
            saveCreditCard : saveCreditCard,
            getCustomer : getCustomer,
            cancelSubscription : cancelSubscription,
            updateCustomer : updateCustomer,

            //community
            addCommunity : addCommunity,
            communityList : communityList,
            acceptMember : acceptMember,
            addPendingMember : addPendingMember,
            declineMember : declineMember,
            addRole : addRole,
            removeMember : removeMember,
            hasCanceledCommunity : hasCanceledCommunity,
            restoreCommunity : restoreCommunity
        };
    }

})();
