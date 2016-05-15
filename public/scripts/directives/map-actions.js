angular.module('PoisRUs').directive('mapActions', [
    'sessionService',
    function(sessionService) {
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
                    return sessionService.isLoggedIn()
                };
            }
        }
    }]);
