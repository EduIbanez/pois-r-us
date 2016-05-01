angular.module('PoisRUs').directive('mapActions', [
    'userService',
    function(userService) {
        return {
            replace: true,
            restrict: 'A',
            templateUrl: '/templates/directives/map-actions.html',
            scope: {
                onSearch: '&',
                onPois: '&',
                onRoutes: '&',
                onAdd: '&'
            },
            link: function(scope, element, attrs) {
                scope.sessionActive = function() {
                    return userService.isLoggedIn()
                };
            }
        }
    }]);
