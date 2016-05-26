(function ()
{
    'use strict';

    angular
        .module('app.dashboard', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.dashboard', {
            url      : '/dashboard',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/dashboard/dashboard-project.html',
                    controller : 'DashboardProjectController as vm'
                }
            },
            resolve  : {
                DashboardData: function (msApi)
                {
                    return {
    "projects": [
        {
            "name": "Create a new community"
        }
    ],
    "widget1": {
        "currentRange": "DT",
        "data": {
            "label": "APPOINTMENTS",
            "count": {
                "DT": 25,
            }
        
        },
        "detail": "You can show some detailed information about this widget in here."
    },
    "widget2": {
        "title": "Overdue",
        "data": {
            "label": "TASKS",
            "count": 4,
            "extra": {
                "label": "Yesterday's overdue",
                "count": 2
            }
        },
        "detail": "You can show some detailed information about this widget in here."
    },
    "widget3": {
        "title": "Issues",
        "data": {
            "label": "OPEN",
            "count": 32,
            "extra": {
                "label": "Closed today",
                "count": 0
            }
        },
        "detail": "You can show some detailed information about this widget in here."
    },
    "widget4": {
        "title": "Features",
        "data": {
            "label": "PROPOSALS",
            "count": 42,
            "extra": {
                "label": "Implemented",
                "count": 8
            }
        },
        "detail": "You can show some detailed information about this widget in here."
    },

    "widget7": {
        "title": "Schedule",
        "ranges": {
            "T": "Today",
            "TM": "Tomorrow"
        },
        "schedule": {
            "T": [
                {
                    "title": "Group Meeting",
                    "time": "In 32 minutes",
                    "location": "Room 1B"
                },
                {
                    "title": "Coffee Break",
                    "time": "10:30 AM"
                },
                {
                    "title": "Public Beta Release",
                    "time": "11:00 AM"
                },
                {
                    "title": "Lunch",
                    "time": "12:10 PM"
                },
                {
                    "title": "Dinner with David",
                    "time": "17:30 PM"
                },
                {
                    "title": "Jane's Birthday Party",
                    "time": "19:30 PM"
                },
                {
                    "title": "Overseer's Retirement Party",
                    "time": "21:30 PM"
                }
            ],
            "TM": [
                {
                    "title": "Marketing Meeting",
                    "time": "09:00 AM"
                },
                {
                    "title": "Public Announcement",
                    "time": "11:00 AM"
                },
                {
                    "title": "Lunch",
                    "time": "12:10 PM"
                },
                {
                    "title": "Meeting with Beta Testers",
                    "time": "15:00 AM"
                },
                {
                    "title": "Live Stream",
                    "time": "17:30 PM"
                },
                {
                    "title": "Release Party",
                    "time": "19:30 PM"
                },
                {
                    "title": "CEO's Party",
                    "time": "22:30 PM"
                }
            ]
        }
    },
    "widget8": {
        "title": "Budget Distribution",
        "mainChart": [
            {
                "label": "Wireframing",
                "value": 12
            },
            {
                "label": "Design",
                "value": 17
            },
            {
                "label": "Coding",
                "value": 28
            },
            {
                "label": "Marketing",
                "value": 25
            },
            {
                "label": "Extra",
                "value": 15
            }
        ]
    },
    "widget9": {
        "title": "Spent",
        "ranges": {
            "TW": "This Week",
            "LW": "Last Week",
            "2W": "2 Weeks Ago"
        },
        "weeklySpent": {
            "title": "WEEKLY SPENT",
            "count": {
                "2W": "2,682.85",
                "LW": "1,445.34",
                "TW": "3,630.15"
            },
            "chart": {
                "label": "Weekly Spent",
                "values": {
                    "2W": [
                        {"x": 0, "y": 6},
                        {"x": 1, "y": 1},
                        {"x": 2, "y": 3},
                        {"x": 3, "y": 4},
                        {"x": 4, "y": 5},
                        {"x": 5, "y": 5},
                        {"x": 6, "y": 2}
                    ],
                    "LW": [
                        {"x": 0, "y": 4},
                        {"x": 1, "y": 6},
                        {"x": 2, "y": 2},
                        {"x": 3, "y": 2},
                        {"x": 4, "y": 1},
                        {"x": 5, "y": 3},
                        {"x": 6, "y": 4}
                    ],
                    "TW": [
                        {"x": 0, "y": 2},
                        {"x": 1, "y": 6},
                        {"x": 2, "y": 5},
                        {"x": 3, "y": 4},
                        {"x": 4, "y": 5},
                        {"x": 5, "y": 3},
                        {"x": 6, "y": 6}
                    ]
                }
            }
        },
        "totalSpent": {
            "title": "TOTAL SPENT",
            "count": {
                "2W": "29,682.85",
                "LW": "31,128.19",
                "TW": "34,758.34"
            },
            "chart": {
                "label": "Spent",
                "values": {
                    "2W": [
                        {"x": 0, "y": 3},
                        {"x": 1, "y": 2},
                        {"x": 2, "y": 2},
                        {"x": 3, "y": 4},
                        {"x": 4, "y": 7},
                        {"x": 5, "y": 7},
                        {"x": 6, "y": 4}
                    ],
                    "LW": [
                        {"x": 0, "y": 5},
                        {"x": 1, "y": 7},
                        {"x": 2, "y": 8},
                        {"x": 3, "y": 8},
                        {"x": 4, "y": 6},
                        {"x": 5, "y": 4},
                        {"x": 6, "y": 1}
                    ],
                    "TW": [
                        {"x": 0, "y": 6},
                        {"x": 1, "y": 3},
                        {"x": 2, "y": 7},
                        {"x": 3, "y": 5},
                        {"x": 4, "y": 5},
                        {"x": 5, "y": 4},
                        {"x": 6, "y": 7}
                    ]
                }
            }
        },
        "remaining": {
            "title": "REMAINING",
            "count": {
                "2W": "94.317,15",
                "LW": "92.871,81",
                "TW": "89.241,66"
            },
            "chart": {
                "label": "Remaining",
                "values": {
                    "2W": [
                        {"x": 0, "y": 1},
                        {"x": 1, "y": 4},
                        {"x": 2, "y": 5},
                        {"x": 3, "y": 7},
                        {"x": 4, "y": 8},
                        {"x": 5, "y": 2},
                        {"x": 6, "y": 4}
                    ],
                    "LW": [
                        {"x": 0, "y": 3},
                        {"x": 1, "y": 2},
                        {"x": 2, "y": 1},
                        {"x": 3, "y": 4},
                        {"x": 4, "y": 8},
                        {"x": 5, "y": 8},
                        {"x": 6, "y": 4}
                    ],
                    "TW": [
                        {"x": 0, "y": 2},
                        {"x": 1, "y": 4},
                        {"x": 2, "y": 8},
                        {"x": 3, "y": 6},
                        {"x": 4, "y": 2},
                        {"x": 5, "y": 5},
                        {"x": 6, "y": 1}
                    ]
                }
            }
        },
        "totalRemaining": {
            "title": "TOTAL BUDGET",
            "count": "124.000,00"
        },
        "totalBudget": {
            "title": "TOTAL BUDGET",
            "count": "124.000,00"
        }
    },
    "widget10": {
        "title": "Budget Details",
        "table": {
            "columns": [
                {
                    "title": "Budget Type"
                },
                {
                    "title": "Total Budget"
                },
                {
                    "title": "Spent ($)"
                },
                {
                    "title": "Spent (%)"
                },
                {
                    "title": "Remaining ($)"
                },
                {
                    "title": "Remaining (%)"
                }
            ],
            "rows": [
                [
                    {
                        "value": "Wireframing",
                        "classes": "text-boxed m-0 deep-orange-bg white-fg",
                        "icon": ""
                    },
                    {
                        "value": "$14,880.00",
                        "classes": "text-bold",
                        "icon": ""
                    },
                    {
                        "value": "$14,000.00",
                        "classes": "",
                        "icon": ""
                    },
                    {
                        "value": "%94.08",
                        "classes": "red-fg",
                        "icon": "icon icon-trending-up s14 red-fg"
                    },
                    {
                        "value": "$880.00",
                        "classes": "",
                        "icon": ""
                    },
                    {
                        "value": "%5.92",
                        "classes": "",
                        "icon": ""
                    }
                ],
                [
                    {
                        "value": "Design",
                        "classes": "text-boxed m-0 purple-bg white-fg",
                        "icon": ""
                    },
                    {
                        "value": "$21,080.00",
                        "classes": "text-bold",
                        "icon": ""
                    },
                    {
                        "value": "$17,240.34",
                        "classes": "",
                        "icon": ""
                    },
                    {
                        "value": "%81.78",
                        "classes": "red-fg",
                        "icon": "icon icon-trending-up s14 red-fg"
                    },
                    {
                        "value": "$3,839.66",
                        "classes": "",
                        "icon": ""
                    },
                    {
                        "value": "%18.22",
                        "classes": "",
                        "icon": ""
                    }
                ],
                [
                    {
                        "value": "Coding",
                        "classes": "text-boxed m-0 light-blue-bg white-fg",
                        "icon": ""
                    },
                    {
                        "value": "$34,720.00",
                        "classes": "text-bold",
                        "icon": ""
                    },
                    {
                        "value": "$3,518.00",
                        "classes": "",
                        "icon": ""
                    },
                    {
                        "value": "%10.13",
                        "classes": "green-fg",
                        "icon": "icon icon-trending-down s14 green-fg"
                    },
                    {
                        "value": "$31,202.00",
                        "classes": "",
                        "icon": ""
                    },
                    {
                        "value": "%89.87",
                        "classes": "",
                        "icon": ""
                    }
                ],
                [
                    {
                        "value": "Marketing",
                        "classes": "text-boxed m-0 pink-bg white-fg",
                        "icon": ""
                    },
                    {
                        "value": "$34,720.00",
                        "classes": "text-bold",
                        "icon": ""
                    },
                    {
                        "value": "$0.00",
                        "classes": "",
                        "icon": ""
                    },
                    {
                        "value": "%0.00",
                        "classes": "green-fg",
                        "icon": "icon icon-minus s14 green-fg"
                    },
                    {
                        "value": "$34,720.00",
                        "classes": "",
                        "icon": ""
                    },
                    {
                        "value": "%100.00",
                        "classes": "",
                        "icon": ""
                    }
                ],
                [
                    {
                        "value": "Extra",
                        "classes": "text-boxed m-0 amber-bg white-fg",
                        "icon": ""
                    },
                    {
                        "value": "$18,600.00",
                        "classes": "text-bold",
                        "icon": ""
                    },
                    {
                        "value": "$0.00",
                        "classes": "",
                        "icon": ""
                    },
                    {
                        "value": "%0.00",
                        "classes": "green-fg",
                        "icon": "icon icon-minus s14 green-fg"
                    },
                    {
                        "value": "$34,720.00",
                        "classes": "",
                        "icon": ""
                    },
                    {
                        "value": "%100.00",
                        "classes": "",
                        "icon": ""
                    }
                ]
            ]
        }
    },
    "widget11": {
        "title": "Team Members",
        "table": {
            "columns": [
                {
                    "title": ""
                },
                {
                    "title": "Name"
                },
                {
                    "title": "Position"
                },
                {
                    "title": "Office"
                },
                {
                    "title": "E-Mail"
                },
                {
                    "title": "Phone"
                }
            ],
            "rows": [
                [
                    "james.jpg",
                    "Jack Gilbert",
                    "Design Manager",
                    "Johor Bahru",
                    "jgilbert48@mail.com",
                    "+16 298 032 7774"
                ],
                [
                    "katherine.jpg",
                    "Kathy Anderson",
                    "Recruiting Manager",
                    "Solţānābād",
                    "kanderson49@mail.com.br",
                    "+23 572 311 1136"
                ],
                [
                    "andrew.jpg",
                    "Mark Turner",
                    "Recruiting Manager",
                    "Neftegorsk",
                    "mturner4a@mail.com",
                    "+01 139 803 9263"
                ],
                [
                    "jane.jpg",
                    "Kathryn Martinez",
                    "Director of Sales",
                    "Palekastro",
                    "kmartinez4b@mail.com",
                    "+25 467 022 5393"
                ],
                [
                    "alice.jpg",
                    "Annie Gonzales",
                    "Actuary",
                    "Candon",
                    "agonzales4c@mail.edu",
                    "+99 891 619 7138"
                ],
                [
                    "vincent.jpg",
                    "Howard King",
                    "Human Resources",
                    "Bergen op Zoom",
                    "hking4d@mail.gov",
                    "+46 984 348 1409"
                ],
                [
                    "joyce.jpg",
                    "Elizabeth Dixon",
                    "Electrical Engineer",
                    "Písečná",
                    "edixon4e@mail.gov",
                    "+33 332 067 9063"
                ],
                [
                    "danielle.jpg",
                    "Dorothy Morris",
                    "Office Assistant",
                    "Magsaysay",
                    "dmorris4f@mail.com",
                    "+05 490 958 6120"
                ],
                [
                    "carl.jpg",
                    "Mark Gonzales",
                    "Quality Control",
                    "Matsue-shi",
                    "mgonzales4g@mail.com",
                    "+03 168 394 9935"
                ],
                [
                    "profile.jpg",
                    "Catherine Rogers",
                    "Programmer Analyst",
                    "Kangar",
                    "crogers4h@mail.com",
                    "+86 235 407 5373"
                ],
                [
                    "garry.jpg",
                    "Ruth Grant",
                    "Community Outreach",
                    "Beaune",
                    "rgrant4i@mail.pl",
                    "+36 288 083 8460"
                ],
                [
                    "james.jpg",
                    "Phyllis Gutierrez",
                    "Administrative Assistant",
                    "Shlissel’burg",
                    "pgutierrez4j@mail.net",
                    "+52 749 861 9304"
                ],
                [
                    "alice.jpg",
                    "Lillian Morris",
                    "Media Planner",
                    "Berlin",
                    "lmorris4k@mail.de",
                    "+59 695 110 3856"
                ],
                [
                    "vincent.jpg",
                    "Jeremy Anderson",
                    "Systems Engineer",
                    "Lũng Hồ",
                    "janderson4l@mail.uk",
                    "+40 384 115 1448"
                ],
                [
                    "carl.jpg",
                    "Arthur Lawrence",
                    "Nurse Practicioner",
                    "Sarkanjut",
                    "alawrence4m@mail.com",
                    "+36 631 599 7867"
                ],
                [
                    "andrew.jpg",
                    "David Simmons",
                    "Social Worker",
                    "Ushumun",
                    "dsimmons4n@mail.com",
                    "+01 189 681 4417"
                ],
                [
                    "danielle.jpg",
                    "Daniel Johnston",
                    "Help Desk",
                    "São Carlos",
                    "djohnston4o@mail.gov",
                    "+60 028 943 7919"
                ],
                [
                    "joyce.jpg",
                    "Ann King",
                    "Internal Auditor",
                    "Liren",
                    "aking4p@mail.com",
                    "+91 103 932 6545"
                ],
                [
                    "james.jpg",
                    "Phillip Franklin",
                    "VP Accounting",
                    "Soba",
                    "pfranklin4q@mail.com",
                    "+25 820 986 7626"
                ],
                [
                    "garry.jpg",
                    "Gary Gonzalez",
                    "Speech Pathologist",
                    "Gangkou",
                    "ggonzalez4r@mail.cc",
                    "+10 862 046 7916"
                ]
            ]
        }
    },
    "weatherWidget": {
        "locations": {
            "NewYork": {
                "name": "New York",
                "icon": "icon-weather-pouring",
                "temp": {
                    "C": "22",
                    "F": "72"
                },
                "windSpeed": {
                    "KMH": 12,
                    "MPH": 7.5
                },
                "windDirection": "NW",
                "rainProbability": "98%",
                "next3Days": [
                    {
                        "name": "Sunday",
                        "icon": "icon-weather-pouring",
                        "temp": {
                            "C": "21",
                            "F": "70"
                        }
                    },
                    {
                        "name": "Sunday",
                        "icon": "icon-weather-pouring",
                        "temp": {
                            "C": "19",
                            "F": "66"
                        }
                    },
                    {
                        "name": "Tuesday",
                        "icon": "icon-weather-partlycloudy",
                        "temp": {
                            "C": "24",
                            "F": "75"
                        }
                    }
                ]
            }
        },
        "currentLocation": "NewYork",
        "tempUnit": "C",
        "speedUnit": "KMH"
    }
};
                }
            },
            bodyClass: 'dashboard-project'
        });

        msNavigationServiceProvider.saveItem('fuse.dashboard', {
            title    : 'Dashboard',
            icon     : 'icon-trello',
            state    : 'app.dashboard',
            weight   : 1
        });

    }

})();
