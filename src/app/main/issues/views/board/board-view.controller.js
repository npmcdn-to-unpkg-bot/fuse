(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .controller('BoardViewController', BoardViewController);

    /** @ngInject */
    function BoardViewController($document, $window, $timeout, $mdDialog, msUtils, $stateParams, SearchService,
       BoardService, CardFilters, DialogService, authentication, apilaData, msNavigationService, $scope)
    {
        var vm = this;

        // Data
        vm.currentView = 'board';
        vm.board = BoardService.data.data;
        vm.board.lists = [];
        vm.board.cards = [];

        var username = authentication.currentUser().name;
        var userid = authentication.currentUser().id;

        var listCopy = null;

        apilaData.userCommunity(username)
        .success(function(d) {
          vm.myCommunity = d;

          issueList(vm.myCommunity._id);
          issuesCount(vm.myCommunity._id);
          listByUsername(vm.myCommunity._id);

          if(vm.myCommunity.creator.name === vm.username) {
            vm.userRole = "creator";
          } else if(vm.myCommunity.boss.name === vm.username) {
            vm.userRole = "boss";
          } else if(vm.myCommunity.directors.indexOf(vm.username) !== -1) {
            vm.userRole = "directors";
          } else if(vm.myCommunity.minions.indexOf(vm.username) !== -1) {
            vm.userRole = "minions";
          }

          listCopy = angular.copy(vm.board.lists);

          var searchParams = ["title", "responsibleParty", "resolutionTimeframe", "submitBy", "description",
                              "status"];

          SearchService.setData(vm.board.cards, searchParams);


          SearchService.subscribe($scope, function() {
            vm.board.cards = SearchService.getResult();
          });

        });

        function inCommunity(name){
          var result = _.find(vm.myCommunity.communityMembers, function(v){
            return v.name === name;
          });

          return result;
        }

        function issuesCount(id) {
          apilaData.openIssuesCount(userid, id)
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

        vm.issueList = BoardService.getIssueByUsername(username);

        vm.boardList = BoardService.list.data;
        vm.cardFilters = CardFilters;
        vm.card = {};
        vm.cardOptions = {};
        vm.newListName = '';
        vm.sortableListOptions = {
            axis       : 'x',
            delay      : 75,
            distance   : 7,
            items      : '> .list-wrapper',
            handle     : '.list-header',
            placeholder: 'list-wrapper list-sortable-placeholder',
            tolerance  : 'pointer',
            start      : function (event, ui)
            {
                var width = ui.item[0].children[0].clientWidth;
                var height = ui.item[0].children[0].clientHeight;
                ui.placeholder.css({
                    'min-width': width + 'px',
                    'width'    : width + 'px',
                    'height'   : height + 'px'
                });
            }
        };
        vm.sortableCardOptions = {
            appendTo            : 'body',
            connectWith         : '.list-cards',
            delay               : 75,
            distance            : 7,
            forceHelperSize     : true,
            forcePlaceholderSize: true,
            handle              : msUtils.isMobile() ? '.list-card-sort-handle' : false,
            helper              : function (event, el)
            {
                return el.clone().addClass('list-card-sort-helper');
            },
            placeholder         : 'list-card card-sortable-placeholder',
            tolerance           : 'pointer',
            scroll              : true,
            sort                : function (event, ui)
            {
                var listContentEl = ui.placeholder.closest('.list-content');
                var boardContentEl = ui.placeholder.closest('#board');

                if ( listContentEl )
                {
                    var listContentElHeight = listContentEl[0].clientHeight,
                        listContentElScrollHeight = listContentEl[0].scrollHeight;

                    if ( listContentElHeight !== listContentElScrollHeight )
                    {
                        var itemTop = ui.position.top,
                            itemBottom = itemTop + ui.item.height(),
                            listTop = listContentEl.offset().top,
                            listBottom = listTop + listContentElHeight;

                        if ( itemTop < listTop + 25 )
                        {
                            listContentEl.scrollTop(listContentEl.scrollTop() - 25);
                        }

                        if ( itemBottom > listBottom - 25 )
                        {
                            listContentEl.scrollTop(listContentEl.scrollTop() + 25);
                        }
                    }
                }

                if ( boardContentEl )
                {
                    var boardContentElWidth = boardContentEl[0].clientWidth;
                    var boardContentElScrollWidth = boardContentEl[0].scrollWidth;

                    if ( boardContentElWidth !== boardContentElScrollWidth )
                    {
                        var itemLeft = ui.position.left,
                            itemRight = itemLeft + ui.item.width(),
                            boardLeft = boardContentEl.offset().left,
                            boardRight = boardLeft + boardContentElWidth;

                        if ( itemLeft < boardLeft + 25 )
                        {
                            boardContentEl.scrollLeft(boardContentEl.scrollLeft() - 25);
                        }

                        if ( itemRight > boardRight )
                        {
                            boardContentEl.scrollLeft(boardContentEl.scrollLeft() + 25);
                        }
                    }
                }
            }
        };

        // Methods
        vm.openCardDialog = DialogService.openCardDialog;
        vm.addNewList = addNewList;
        vm.removeList = removeList;
        vm.cardFilter = cardFilter;
        vm.isOverdue = isOverdue;

        //OUR DATA LOADING AD SETTING CODE

        //push the first list for cuurent User, so it's always the first one
        vm.board.lists.push(  {
              "id": msUtils.guidGenerator(),
              "name": username,
              "idCards": []
          });

          //get the current board we are on to load proper data
          var status = "";

          if($stateParams.uri === "open-issues" || $stateParams.uri === ""){
            status="Open";
          } else if($stateParams.uri === "shelved-issues") {
            status = "Shelved";
          } else if($stateParams.uri === "closed-issues") {
            status = "Closed";
          }


        function listByUsername(id)
        {
          //add our first list of issues for our current user
          apilaData.listIssueByUsername(username, status, id)
              .success(function(issues) {

                //add card to first list
                var currUserIssues = _.filter(issues, {"responsibleParty" : userid});

                vm.board.labels = vm.board.labels.concat(_.flatten(_.map(issues, "labels")));

                addCardsToList(currUserIssues, vm.board.lists[0]);
              })
              .error(function(issues) {
                  console.log("Error while loading list of issues for: " + username);
              });
        }



          function populateIssues() {
            apilaData.usersList()
              .success(function(d) {


                //foreach user make them a list
                angular.forEach(d, function(v, k) {

                    if(inCommunity(v.name) !== undefined){
                        var inList = false;
                        angular.forEach(vm.board.lists, function(value, key) {
                          if(value.name === v.name) {
                            inList = true;
                          }
                        });
                        if(inList === false) {
                          console.log(v.name);
                          var currList = {
                            id: msUtils.guidGenerator(),
                            name: v.name,
                            idCards: []
                          };

                          if(currList.name !== username) {
                              console.log(currList);
                              vm.board.lists.push(currList);
                            }
                        }
                  }


                });

              })
              .error(function(d) {
                console.log("error while loading users");
              });
            }


            function issueList(id){
              //add all the other issues assigned to users
              apilaData.issuesList(status, id)
                    .success(function(issues) {

                    //  console.log(issues);

                      angular.forEach(issues, function(v, k) {

                        console.log(v._id.name);

                        var currList = {
                          id: msUtils.guidGenerator(),
                          name: v._id.name,
                          idCards: []
                        };


                        //we don't want to add ourself to the list, we are alreadt first
                        if(currList.name !== username) {

                           //add all the cards
                            angular.forEach(v.issues, function(value, key) {
                              value.id = msUtils.guidGenerator();
                              value.name = value.title;

                              var confidential = false;

                              // the issue is confidential and it's not from our user don't show it
                              if(value.confidential !== undefined) {
                                if(value.confidential === true && value.submitBy !== username) {
                                  confidential = true;
                                }
                              }

                              if(confidential === false) {
                                value.due = value.due;

                                vm.board.cards.push(value);
                                currList.idCards.push(value.id);
                              }

                            });
                            console.log(currList);
                              vm.board.lists.push(currList);
                          }
                          });

                          //add empty lists with users with no issues
                          populateIssues();

                    })
                    .error(function(issues) {
                        console.log("Error while loading list of issues for: " + username);
                    });

            }


        init();

        /**
         * Initialize
         */
        function init()
        {

            $timeout(function ()
            {
                // IE list-content max-height hack
                if ( angular.element('html').hasClass('explorer') )
                {
                    // Calculate the height for the first time
                    calculateListContentHeight();

                    // Attach calculateListContentHeight function to window resize
                    $window.onresize = function ()
                    {
                        calculateListContentHeight();
                    };
                }
            }, 0);

        }

        /**
         * IE ONLY
         * Calculate the list-content height
         * IE ONLY
         */
        function calculateListContentHeight()
        {
            var boardEl = angular.element('#board');
            var boardElHeight = boardEl.height();

            boardEl.find('.list-wrapper').each(function (index, el)
            {
                // Get the required heights for calculations
                var listWrapperEl = angular.element(el),
                    listHeaderElHeight = listWrapperEl.find('.list-header').height(),
                    listFooterElHeight = listWrapperEl.find('.list-footer').height();

                // Calculate the max height
                var maxHeight = boardElHeight - listHeaderElHeight - listFooterElHeight;

                // Add the max height
                listWrapperEl.find('.list-content').css({'max-height': maxHeight});
            });
        }

        /**
         * Add new list
         */
        function addNewList()
        {
            if ( vm.newListName === '' )
            {
                return;
            }

            vm.board.lists.push({
                id     : msUtils.guidGenerator(),
                name   : vm.newListName,
                idCards: []
            });

            vm.newListName = '';
        }


        /**
         * Remove list
         *
         * @param ev
         * @param list
         */
        function removeList(ev, list)
        {
            var confirm = $mdDialog.confirm({
                title              : 'Remove List',
                parent             : $document.find('#issues'),
                textContent        : 'Are you sure want to remove list?',
                ariaLabel          : 'remove list',
                targetEvent        : ev,
                clickOutsideToClose: true,
                escapeToClose      : true,
                ok                 : 'Remove',
                cancel             : 'Cancel'
            });
            $mdDialog.show(confirm).then(function ()
            {
                vm.board.lists.splice(vm.board.lists.indexOf(list), 1);
            }, function ()
            {
                // Canceled
            });

        }

        //adds a list of cards to a selected list
        function addCardsToList(cards, list) {

          angular.forEach(cards, function(v, key) {
            v.id = v._id;
            v.name = v.title;

            var confidential = false;

            // the issue is confidential and it's not from our user don't show it
            if(v.confidential !== undefined) {
              if(v.confidential === true && v.submitBy !== username) {
                confidential = true;
              }
            }

            if(confidential === false) {
              vm.board.cards.push(v);
              list.idCards.push(v.id);
            }

          });


        }

        /**
         * Card filter
         *
         * @param cardId
         * @returns {*}
         */
        function cardFilter(cardId)
        {
            var card = vm.board.cards.getById(cardId);

            try
            {
                if ( angular.lowercase(card.name).indexOf(angular.lowercase(vm.cardFilters.name)) < 0 )
                {
                    throw false;
                }

                angular.forEach(vm.cardFilters.labels, function (label)
                {
                    if ( !msUtils.exists(label, card.idLabels) )
                    {
                        throw false;
                    }
                });

                angular.forEach(vm.cardFilters.members, function (member)
                {
                    if ( !msUtils.exists(member, card.idMembers) )
                    {
                        throw false;
                    }
                });


            } catch ( err )
            {
                return err;
            }

            return true;
        }

        /**
         * Is the card overdue?
         *
         * @param cardDate
         * @returns {boolean}
         */
        function isOverdue(cardDate)
        {
            return moment() > moment(cardDate, 'x');
        }
    }
})();
