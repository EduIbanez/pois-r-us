angular.module('PoisRUs').controller('LoginCtrl', [
    '$scope', '$state', 'userService',
    function($scope, $state, userService) {

        $scope.fakeLogin = function() {
            userService.logIn('dummy', 'pass');
            $state.go('map');
        }

    }]);
