(function ()
{
    'use strict';

    angular
        .module('fuse')
        .config(routeConfig)
        .run(routeRun);

    function routeRun($rootScope, $location, authentication) {

      //urls we can't visit while we're not logged in
      var restrictedUrls = ['app.residents', 'app.appointments', 'app.issues.boards.board', 'app.dashboard'];

      $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

          //if we go to login and we are already logged in, switch to appointments
          if(toState.name === "app.pages_auth_login" && authentication.isLoggedIn()) {
            $location.path('/dashboard');
          }

          //if we go to homepage and we are already logged in, switch to appointments
          if(toState.name === "app.homepage" && authentication.isLoggedIn()) {
            $location.path('/dashboard');
          }

          //if we are not logged in and it's a restricted url, switch page
          if(!authentication.isLoggedIn()) {
            if(_.includes(restrictedUrls, toState.name) === true) {
                $location.path('/not-auth');
            }
          }
        });
    }

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider)
    {
        $locationProvider.html5Mode(true);

       // $urlRouterProvider.otherwise('/sample');
       $urlRouterProvider.when('/', '/homepage');
       $urlRouterProvider.otherwise('/errors/error-404');

        /**
         * Layout Style Switcher
         *
         * This code is here for demonstration purposes.
         * If you don't need to switch between the layout
         * styles like in the demo, you can set one manually by
         * typing the template urls into the `State definitions`
         * area and remove this code
         */
        // Inject $cookies
        var $cookies;

        angular.injector(['ngCookies']).invoke([
            '$cookies', function (_$cookies)
            {
                $cookies = _$cookies;
            }
        ]);

        // Get active layout
        var layoutStyle = $cookies.get('layoutStyle') || 'verticalNavigation';

        var layouts = {
            verticalNavigation  : {
                main      : 'app/core/layouts/vertical-navigation.html',
                toolbar   : 'app/toolbar/layouts/vertical-navigation/toolbar.html',
                navigation: 'app/navigation/layouts/vertical-navigation/navigation.html'
            },
            horizontalNavigation: {
                main      : 'app/core/layouts/horizontal-navigation.html',
                toolbar   : 'app/toolbar/layouts/horizontal-navigation/toolbar.html',
                navigation: 'app/navigation/layouts/horizontal-navigation/navigation.html'
            },
            contentOnly         : {
                main      : 'app/core/layouts/content-only.html',
                toolbar   : '',
                navigation: ''
            },
            contentWithToolbar  : {
                main      : 'app/core/layouts/content-with-toolbar.html',
                toolbar   : 'app/toolbar/layouts/content-with-toolbar/toolbar.html',
                navigation: ''
            }
        };
        // END - Layout Style Switcher

        // State definitions
        $stateProvider
            .state('app', {
                abstract: true,
                views   : {
                    'main@'         : {
                        templateUrl: layouts[layoutStyle].main,
                        controller : 'MainController as vm'
                    },
                    'toolbar@app'   : {
                        templateUrl: layouts[layoutStyle].toolbar,
                        controller : 'ToolbarController as vm'
                    },
                    'navigation@app': {
                        templateUrl: layouts[layoutStyle].navigation,
                        controller : 'NavigationController as vm'
                    },
                    'quickPanel@app': {
                        templateUrl: 'app/quick-panel/quick-panel.html',
                        controller : 'QuickPanelController as vm'
                    }
                }
            });

      $httpProvider.interceptors.push('errorInterceptor');
    }

})();
