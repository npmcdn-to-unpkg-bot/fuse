(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .controller('ScrumboardCardDialogController', ScrumboardCardDialogController);

    /** @ngInject */
    function ScrumboardCardDialogController($document, $mdDialog, fuseTheming, $scope, $timeout, exportPdf,
      fuseGenerator, msUtils, BoardService, cardId, apilaData, authentication, msNavigationService, ImageUploadService, UpdateInfoService)
    {
        var vm = this;

        // Data
        vm.board = BoardService.data.data;
        vm.card = vm.board.cards.getById(cardId);

        vm.card.currdue = vm.card.due;

        console.log(vm.card);

        vm.card.labels.map(function(d){d.id = d._id; return d;});
        vm.board.labels.map(function(d){d.id = d._id; return d;});

        vm.newLabelColor = 'red';
        vm.members = vm.board.members;

        vm.labels = vm.board.labels;

        vm.newCheckListTitle = "Checklist";

        vm.username = authentication.currentUser().name;

        vm.now = new Date();

        apilaData.userCommunity(vm.username)
        .success(function(d) {

          vm.myCommunity = d;

          if(vm.myCommunity.creator.name === vm.username) {
            vm.userRole = "creator";
          } else if(vm.myCommunity.boss.name === vm.username) {
            vm.userRole = "boss";
          } else if(_.find(vm.myCommunity.directors, {"name" : vm.username}) !== undefined) {
            vm.userRole = "directors";
          } else if(_.find(vm.myCommunity.minions, {"name" : vm.username}) !== undefined) {
            vm.userRole = "minions";
          }

          console.log(vm.userRole);

          //load member list
          apilaData.usersInCommunity(d)
              .success(function(d) {
                vm.members = d;
              })
              .error(function(d) {
                console.log("error while loading users");
              });
        });

        var unchangedDueDate = angular.copy(vm.card.due);

        $scope.$watch('vm.card.currdue', function() {
          if(unchangedDueDate !== vm.card.currdue) {

            if(vm.card.currdue != null) {
              if(vm.card.currdue !== "2016") {
                vm.card.due = vm.card.currdue;
                if(vm.card.due !== "") {
                  vm.card.updateInfo.push(UpdateInfoService.setUpdateInfo('due', vm.card.currdue, ""));
                }

                vm.updateIssue();
              }
            }

          }
        });

       vm.removeCheckItem = function(checklist, i) {
         var checkItemName = checklist.checkItems[i].name;
         checklist.checkItems.splice(i, 1);
         vm.card.updateInfo.push(UpdateInfoService.setUpdateInfo('checkitem_remove', "" , checkItemName));
         vm.updateIssue();
       }

       vm.updateCheckItem = function(checklist, checkitemId, text) {
         checklist.checkItems[checkitemId] = text;

         console.log("Updated checkitem");
         console.log(checklist.checkItems[checkitemId]);

         vm.card.updateInfo.push(UpdateInfoService.setUpdateInfo('checkitem_change', "" , text.name));

         vm.updateIssue();
       }

       vm.openImage = function(url){
         $mdDialog.show({
               controllerAs: 'vm',
               controller: 'ImageViewController',
               preserveScope: true,
               autoWrap: true,
               skipHide: true,
               templateUrl: 'app/main/issues/dialogs/card/imageView.html',
               resolve: {
                 imgUrl: function() {
                   return url;
                 }
               }
             });
        }


        // Methods
        vm.palettes = fuseTheming.getRegisteredPalettes();
        vm.rgba = fuseGenerator.rgba;
        vm.toggleInArray = msUtils.toggleInArray;
        vm.exists = msUtils.exists;
        vm.existsMembers = msUtils.exists;
        vm.closeDialog = closeDialog;
        vm.getCardList = getCardList;
        vm.removeCard = removeCard;
        /* Attachment */
        vm.toggleCoverImage = toggleCoverImage;
        vm.removeAttachment = removeAttachment;
        /* Labels */
        vm.labelQuerySearch = labelQuerySearch;
        vm.filterLabel = filterLabel;
        vm.addNewLabel = addNewLabel;
        vm.removeLabel = removeLabel;
        vm.removeLabelFromCard = removeLabelFromCard;
        vm.editLabel = editLabel;
        vm.addLabelToCard = addLabelToCard;
        vm.isLabelInCard = isLabelInCard;

        /* Members */
        vm.memberQuerySearch = memberQuerySearch;
        vm.filterMember = filterMember;
        vm.addMembers = addMembers;
        /* Checklist */
        vm.updateCheckedCount = updateCheckedCount;
        vm.addCheckItem = addCheckItem;
        vm.removeChecklist = removeChecklist;
        vm.createCheckList = createCheckList;
        /* Comment */
        vm.addNewComment = addNewComment;
        vm.updateIssue = updateIssue;

        vm.wordCloud = wordCloud;

        vm.createdIssue = vm.card.submitBy + " created " + vm.card.title + " " + UpdateInfoService.timeDiff(vm.card.submitDate)

        vm.formatUpdateArray = function(updateField, updateBy, updateDate) {
          return UpdateInfoService.formatUpdateArray(updateField, updateBy, updateDate);
        }
        vm.changeStatus = changeStatus;
        vm.exportIssue = exportIssue;

        vm.uploadFiles = function(file, invalidFiles, card) {
          ImageUploadService.uploadFiles(file, invalidFiles, card, UpdateInfoService.setUpdateInfo);
        }

        vm.removeDueDate = function() {
          vm.card.updateInfo.push(UpdateInfoService.setUpdateInfo('due', "" , vm.card.currdue));
          vm.card.currdue = '';

          updateIssue();
        }

        vm.updateTextFields = function(type) {
          console.log("dvaput");
          vm.card.updateInfo.push(UpdateInfoService.setUpdateInfo(type, vm.card[type], ""));
          vm.updateIssue();
        }

        //deleting a member
        vm.memberUpdate = function(selectedMember) {

          vm.card.deletedMember = selectedMember;

          vm.card.updateInfo.push(UpdateInfoService.setUpdateInfo('idMembers', "" , selectedMember));

          updateIssue(selectedMember);

        }

        vm.updateLabel = function(labelid) {

          for(var i = 0; i < vm.card.labels.length; ++i) {
            if(vm.card.labels[i].id === labelid) {
              console.log(vm.card.labels[i]);
            }
          }

          vm.updateIssue();

        }

        vm.selectedItemChange = function(selectedMember) {

          if(selectedMember !== null) {
            updateIssue();
          }
        }


        //////////

        /**
         * Close Dialog
         */
        function closeDialog()
        {
            $mdDialog.hide();
        }

        /**
         * Get Card List
         */
        function getCardList()
        {
            var response;
            for ( var i = 0, len = vm.board.lists.length; i < len; i++ )
            {
                if ( vm.board.lists[i].idCards.indexOf(vm.card.id) > -1 )
                {
                    response = vm.board.lists[i];
                    break;
                }
            }
            return response;
        }

        /**
         * Remove card
         *
         * @param ev
         */
        function removeCard(ev)
        {
            var confirm = $mdDialog.confirm({
                title              : 'Remove Card',
                parent             : $document.find('#issues'),
                textContent        : 'Are you sure want to remove card?',
                ariaLabel          : 'remove card',
                targetEvent        : ev,
                clickOutsideToClose: true,
                escapeToClose      : true,
                ok                 : 'Remove',
                cancel             : 'Cancel'
            });

            $mdDialog.show(confirm).then(function ()
            {
                var cardList = getCardList();

                cardList.idCards.splice(cardList.idCards.indexOf(vm.card.id), 1);

                vm.board.cards.splice(vm.board.cards.indexOf(vm.card), 1);

                //delete that issue
                apilaData.deleteIssue(vm.card._id)
                .success(function(d) {

                  vm.username = authentication.currentUser().name;

                  apilaData.openIssuesCount(vm.username)
                    .success(function(count) {
                      msNavigationService.saveItem('fuse.issues', {
                        badge: {
                          content:  count,
                          color  : '#F44336'
                        }
                      });
                    })
                    .error(function(count) {
                    })

                })
                .error(function(d) {

                });

            }, function ()
            {
                // Canceled
            });
        }

        function wordCloud() {
          console.log("kek");
          $mdDialog.show({
                controllerAs: 'vm',
                controller: 'WordCloudController',
                preserveScope: true,
                autoWrap: true,
                skipHide: true,
                templateUrl: 'app/main/issues/dialogs/wordCloud/wordCloud.html',
                locals: {
                  issue: vm.card
                }
              });
        }

        /**
         * Toggle cover image
         *
         * @param attachmentId
         */
        function toggleCoverImage(attachmentId)
        {
            if ( attachmentId === vm.card.idAttachmentCover )
            {
                vm.card.idAttachmentCover = null;
            }
            else
            {
                vm.card.idAttachmentCover = attachmentId;
            }
        }

        /**
         * Remove attachment
         *
         * @param item
         */
        function removeAttachment(item)
        {

            if ( vm.card.idAttachmentCover === item.id )
            {
                vm.card.idAttachmentCover = '';
            }

            var updateInfo = UpdateInfoService.setUpdateInfo('attachments', "" , item.name);

            apilaData.deleteAttachment(vm.card._id, item._id, vm.card)
            .success(function(d) {
              vm.card.attachments.splice(vm.card.attachments.indexOf(item), 1);
              vm.card.updateInfo.push(updateInfo);
            })
            .error(function(d) {
              console.log("Error removing attachment");
            });


        }

        /**
         * Add label chips
         *
         * @param query
         * @returns {filterFn}
         */
        function labelQuerySearch(query)
        {
            return query ? vm.labels.filter(createFilterFor(query)) : [];
        }

        /**
         * Label filter
         *
         * @param label
         * @returns {boolean}
         */
        function filterLabel(label)
        {
            if ( !vm.labelSearchText || vm.labelSearchText === '' )
            {
                return true;
            }

            return angular.lowercase(label.name).indexOf(angular.lowercase(vm.labelSearchText)) >= 0;
        }

        function editLabel(id) {
          vm.labelTabIndex = 2
          vm.editLabelId = id;
        }

        function addLabelToCard(id) {
          if(!isLabelInCard(id)) {
            vm.card.labels.push(vm.board.labels.getById(id));

            vm.card.updateInfo.push(UpdateInfoService.setUpdateInfo('labels', vm.board.labels.getById(id).name, ""));
          } else {
            removeLabelFromCard(id);
          }

          updateIssue();

        }

        function isLabelInCard(id) {
          for(var i = 0; i < vm.card.labels.length; ++i) {
            if(vm.card.labels[i].id === id) {
              return true;
            }
          }

          return false;
        }

        function removeLabelFromCard(id) {

          var index = null;
          for(var i = 0; i < vm.card.labels.length; ++i) {
            if(vm.card.labels[i].id === id) {
              index = i;
              break;
            }
          }

          if(index != null) {
            vm.card.labels.splice(index, 1);
          }

        }

        /**
         * Add new label
         */
        function addNewLabel()
        {
            var label = {
                id   : msUtils.guidGenerator(),
                name : vm.newLabelName,
                color: vm.newLabelColor,
                author: authentication.currentUser().name
            };

            label.updateInfo = UpdateInfoService.setUpdateInfo('labels', label.name, "");

            //send data to the api
            apilaData.addIssueLabelById(vm.card._id, label)
            .success(function(data) {
              data.id = data._id;
              vm.board.labels.push(data);
              vm.card.updateInfo.push(label.updateInfo);

              vm.newLabelName = '';

            })
            .error(function(data) {
              console.log("Error while adding label");
            });

        }

        /**
         * Remove label
         */
        function removeLabel(id)
        {
            var arr = vm.board.labels;
            arr.splice(arr.indexOf(arr.getById(vm.editLabelId)), 1);

            console.log(id);

            var updateInfo = UpdateInfoService.setUpdateInfo('labels', "", id.name);

            apilaData.deleteIssueLabelById(vm.card._id, id._id)
            .success(function(d) {

              vm.card.updateInfo.push(updateInfo);

              angular.forEach(vm.board.cards, function (card)
              {
                  if ( card.idLabels && card.idLabels.indexOf(vm.editLabelId) > -1 )
                  {
                      card.idLabels.splice(card.idLabels.indexOf(vm.editLabelId), 1);
                  }
              });

            })
            .error(function() {
              console.log("Error while deleting label");
            });



            vm.newLabelName = '';
        }

        /**
         * Add member chips
         *
         * @param query
         * @returns {Array}
         */
        function memberQuerySearch(query)
        {
            return query ? vm.members.filter(createFilterFor(query)) : [];
        }

        /**
         * Member filter
         *
         * @param member
         * @returns {boolean}
         */
        function filterMember(member)
        {
            if ( !vm.memberSearchText || vm.memberSearchText === '' )
            {
                return true;
            }

            return angular.lowercase(member.name).indexOf(angular.lowercase(vm.memberSearchText)) >= 0;
        }

        function addMembers(item, array) {

            msUtils.toggleInArray(item, array);

            vm.card.updateInfo.push(UpdateInfoService.setUpdateInfo('idMembers', item.name, ""));

            updateIssue();

        }

        /**
         * Update check list stats
         * @param list
         */
        function updateCheckedCount(list)
        {
            var checkItems = list.checkItems;
            var checkedItems = 0;
            var allCheckedItems = 0;
            var allCheckItems = 0;

            angular.forEach(checkItems, function (checkItem)
            {
                if ( checkItem.checked )
                {
                    checkedItems++;
                }
            });

            list.checkItemsChecked = checkedItems;

            angular.forEach(vm.card.checklists, function (item)
            {
                allCheckItems += item.checkItems.length;
                allCheckedItems += item.checkItemsChecked;
            });

            vm.card.checkItems = allCheckItems;
            vm.card.checkItemsChecked = allCheckedItems;

            console.log(list);

            list.updateInfo = UpdateInfoService.setUpdateInfo("checkitem_checked", "jbg", "");

            apilaData.updateCheckList(vm.card._id, list._id, list)
            .success(function(d) {

            })
            .error(function() {
              console.log("Error while updateing checklist");
            });
        }

        /**
         * Add checklist item
         *
         * @param text
         * @param checkList
         */
        function addCheckItem(text, checkList)
        {
            if ( !text || text === '' )
            {
                return;
            }

            var newCheckItem = {
                'name'   : text,
                'checked': false
            };

            checkList.checkItems.push(newCheckItem);
            console.log(checkList);

            checkList.updateInfo = UpdateInfoService.setUpdateInfo('checkitem', newCheckItem.name, "");

            apilaData.updateCheckList(vm.card._id, checkList._id, checkList)
            .success(function(d) {

                vm.card.updateInfo.push(checkList.updateInfo);
                updateCheckedCount(checkList);

            })
            .error(function() {
              console.log("Error while updateing checklist");
            });

        }

        function exportIssue() {
          console.log(vm.card);

          exportPdf.exportIssue(vm.card);
        }

        /**
         * Remove checklist
         *
         * @param item
         */
        function removeChecklist(item)
        {

           var updateInfo = UpdateInfoService.setUpdateInfo("checklists", "", item.checklistName);

            //send remove request to the api
            apilaData.deleteCheckList(vm.card._id, item._id)
            .success(function(d) {
              vm.card.checklists.splice(vm.card.checklists.indexOf(item), 1);

              vm.card.updateInfo.push(updateInfo);

              angular.forEach(vm.card.checklists, function (list)
              {
                  updateCheckedCount(list);
              });
            })
            .error(function(d){
              console.log("Error while removing checklist");
            });

        }

        /**
         * Create checklist
         */
        function createCheckList()
        {

            var data = {
                id               : msUtils.guidGenerator(),
                name             : vm.newCheckListTitle,
                checklistName    : vm.newCheckListTitle,
                checkItemsChecked: 0,
                checkItems       : []
            };

            data.updateInfo = UpdateInfoService.setUpdateInfo('checklists', data.name, "");

            vm.newCheckListTitle = '';

            apilaData.addCheckList(vm.card._id, data)
            .success(function(d) {
                vm.card.checklists.push(d);
                vm.card.updateInfo.push(data.updateInfo);
                vm.newCheckListTitle = "Checklist";
            })
            .error(function(d) {
              console.log("Error while adding checklist");
            });
        }

        /**
         * Add new comment
         *
         * @param newCommentText
         */
        function addNewComment(newCommentText)
        {
            //send the comment to the api

            console.log(vm.card);

            var issueid = vm.card._id;

            var commentData = {
              commentText: newCommentText,
              author: authentication.currentUser().name
            };

            vm.card.updateInfo.push(UpdateInfoService.setUpdateInfo('comments', commentData.commentText, ""));

            apilaData.addIssueCommentById(issueid, commentData)
            .success(function(data) {
              console.log(data);

              var newComment = {
                  idMember: '',
                  commentText : newCommentText,
                  author    : data.author
              };

              vm.card.comments.unshift(newComment);

            }).error(function(data) {
              console.log("Error while adding comment");
            });


        }

        var oldData = angular.copy(vm.card);

        function updateIssue(deletedMember) {

          vm.card.title = vm.card.name;

          //add updateInfo Data
          vm.card.modifiedBy = authentication.currentUser().name;
          vm.card.modifiedDate = new Date();


          vm.card.updateField = UpdateInfoService.checkChangedFields(oldData, vm.card, deletedMember);


          apilaData.updateIssue(vm.card._id, vm.card)
          .success(function(data) {
            console.log("updated issue");
            vm.card.updateInfo = data.updateInfo;

          }).error(function(data) {
            console.log("Error while adding comment");
          });
        }


        /**
         * Filter for chips
         *
         * @param query
         * @returns {filterFn}
         */
        function createFilterFor(query)
        {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item)
            {
                return angular.lowercase(item.name).indexOf(lowercaseQuery) >= 0;
            };
        }




        function changeStatus() {

          if(vm.card.status === "Shelved") {
            vm.card.shelvedDate = new Date();
          }

          vm.card.updateInfo.push(UpdateInfoService.setUpdateInfo('status', vm.card.status, ""));

          vm.updateIssue();

          // delete card
          var cardList = getCardList();

          cardList.idCards.splice(cardList.idCards.indexOf(vm.card.id), 1);
          vm.board.cards.splice(vm.board.cards.indexOf(vm.card), 1);
        }
    }
})();
