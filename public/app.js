var app = angular.module('PoisRUs', ['ui.router', 'ngResource']);

app.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/templates/views/home.html',
            controller: 'HomeCtrl'
        })

    $urlRouterProvider.otherwise('home');

});

app.constant('BaseRoutes', {
    globalRoot: 'http://localhost:3000',
    apiRoot: 'http://localhost:3000/api'
});
