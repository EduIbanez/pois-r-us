angular.module('PoisRUs').controller('LoginCtrl', [
    '$scope', '$state', 'sessionService',
    function($scope, $state, sessionService) {

        $scope.login = {
            email: null,
            password: null,
            remember: false,
            error: null
        };

        $scope.login = {
            email: null,
            fName: null,
            lName: null,
            password: null,
            error: null
        };

        $scope.register = function() {
            window.alert('Not available yet :(');
        }

        $scope.login = function() {
            sessionService.login($scope.login.email,
                                 $scope.login.password,
                                 $scope.login.remember,
                                 function(error, sessionData) {
                if (!error) $state.go('map');
                else $scope.login.error = true;
            });
            $scope.login.password = null;
        }

    }]);
