
/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

App.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
        function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
            'use strict';

            // Set the following to true to enable the HTML5 Mode
            // You may have to set <base> tag in index and a routing configuration in your server
            $locationProvider.html5Mode(false);

            // defaults to dashboard
            $urlRouterProvider.otherwise('/login');

            //
            // Application Routes
            // -----------------------------------
            $stateProvider
                .state('app', {
                    url: '/app',
                    abstract: true,
                    templateUrl: helper.basepath('app.html'),
                    controller: 'AppController',
                    resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl', 'bootbox', 'moment')
                })
                .state('app.department', {
                    url: '/department',
                    title: '部门管理',
                    templateUrl: helper.basepath('department.html'),
                    resolve: helper.resolveFor('ngDialog'),
                    controller: 'DepartmentController'
                })
                .state('app.user', {
                    url: '/user',
                    title: '用户管理',
                    templateUrl: helper.basepath('user.html'),
                    resolve: helper.resolveFor('ngDialog'),
                    controller: 'UserController'
                })
                .state('app.template', {
                url: '/template',
                title: '用户管理',
                templateUrl: helper.basepath('template.html'),
                resolve: helper.resolveFor('ngDialog'),
                controller: 'TemplateController'
            })
                .state('login', {
                    url: '/login',
                    title: '登录',
                    templateUrl: 'app/pages/login.html'
                })
                .state('logout', {
                    url: '/logout',
                    title: '登录',
                    templateUrl: 'app/pages/login.html'
                })
            ;


        }]).config(['$ocLazyLoadProvider', 'APP_REQUIRES', function ($ocLazyLoadProvider, APP_REQUIRES) {
        'use strict';

        // Lazy Load modules configuration
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: APP_REQUIRES.modules
        });

    }]).config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
        function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
            'use strict';
            // registering components after bootstrap
            App.controller = $controllerProvider.register;
            App.directive = $compileProvider.directive;
            App.filter = $filterProvider.register;
            App.factory = $provide.factory;
            App.service = $provide.service;
            App.constant = $provide.constant;
            App.value = $provide.value;

        }]).config(['tmhDynamicLocaleProvider', function (tmhDynamicLocaleProvider) {

        tmhDynamicLocaleProvider.localeLocationPattern('vendor/angular-i18n/angular-locale_{{locale}}.js');

        // tmhDynamicLocaleProvider.useStorage('$cookieStore');

    }]).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.latencyThreshold = 500;
        cfpLoadingBarProvider.parentSelector = '.wrapper > section';
    }]).factory('httpInterceptor',
    function ($q, $rootScope) {
        return {
            'request': function (config) {
                $rootScope.loading = 1;
                return config;
            },
            'response': function (response) {
                $rootScope.loading = 0;
                return response;
            },
            'requestError': function (rejection) {
                return response;
            },
            'responseError': function (rejection) {
                if (rejection.status == 401) {
                    window.location.href = '/merchants';
                }
                return rejection;
            }
        };
    }).config(function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    })


