angular.module('PoisRUs').directive('navbar', [
    '$state', 'sessionService',
    function($state, sessionService) {
        return {
            replace: true,
            restrict: 'A',
            templateUrl: '/templates/directives/navbar.html',
            scope: {
                activeSection: '@',
            },
            link: function (scope, element, attrs) {
                scope.logOut = function() {
                    $state.go('login');
                    sessionService.logout();
                };
                scope.sessionActive = function() {
                    return sessionService.isLoggedIn()
                };
            }
        };
    }
]);
