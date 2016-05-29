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
        "title": "Community Members",
        "table": {
            "columns": [
                {
                    "title": ""
                },
                {
                    "title": "Name"
                },
                {
                    "title": "Email"
                },
            ],
            "rows": [
                [
                    "james.jpg",
                    "Jack Gilbert",
                    "Design Manager",
                    "Johor Bahru",
                ]
            ]
        }
    },
    "pendingMemberWidget": {
        "title": "Pending Members",
        "table": {
            "columns": [
                {
                    "title": ""
                },
                {
                    "title": "Name"
                },
                {
                    "title": "Email"
                },
                {
                    "title": ""
                },
                {
                    "title": ""
                },
            ],
            "rows": [

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
