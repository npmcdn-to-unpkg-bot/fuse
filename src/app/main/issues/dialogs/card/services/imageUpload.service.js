(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .service('ImageUploadService', ImageUploadService);

    /** @ngInject */
    function ImageUploadService(apilaData, Upload, authentication, $timeout) {

      var uploadFiles = function(file, errFiles, card, setUpdateInfo) {
        console.log(file);


        var uploadUrl = apilaData.getApiUrl() + '/api/issues/'+ card._id + '/attachments/new';

        var updateInfo = setUpdateInfo('attachments',file.name , "");

        if (file) {
            file.upload = Upload.upload({
                url: uploadUrl,
                data: {file: file, updateInfo: updateInfo},
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    card.attachments.push(response.data);
                    console.log(response.data);
                    card.updateInfo.push(updateInfo);
                });
            }, function (response) {

            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                                         evt.loaded / evt.total));
            });
        }
      }

      return {
        uploadFiles : uploadFiles
      }
    }


})();
