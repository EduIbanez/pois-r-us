angular.module('PoisRUs').directive('navbar', [
    '$state', 'userService',
    function($state, userService) {
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
                    userService.logOut();
                };
                scope.sessionActive = function() {
                    return userService.isLoggedIn()
                };
            }
        };
    }
]);
