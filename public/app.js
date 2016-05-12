var app = angular.module('PoisRUs', ['ui.router', 'ngResource']);

app.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider

        .state('login', {
            url: '/login',
            templateUrl: '/templates/views/login.html',
            controller: 'LoginCtrl'
        })

        .state('map', {
            url: '/map',
            templateUrl: '/templates/views/map.html',
            controller: 'MapCtrl'
        })

        .state('stats', {
            url: '/stats',
            templateUrl: '/templates/views/stats.html',
        })

        .state('settings', {
            url: '/settings',
            templateUrl: '/templates/views/settings.html',
        })

    $urlRouterProvider.otherwise('map');

});

app.constant('BaseRoutes', {
    globalRoot: '',
    apiRoot: '/api'
});
