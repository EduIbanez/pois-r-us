angular.module('PoisRUs').controller('LoginCtrl', [
    '$scope', '$state', 'sessionService', 'userService',
    function($scope, $state, sessionService, userService) {

        $scope.loginData = {
            email: null,
            password: null,
            remember: false,
            error: null
        };

        $scope.registerData = {
            email: null,
            fName: null,
            lName: null,
            error: null
        };

        $scope.showTnC = function() {
            window.alert('By using this web application you agree to offer us '
                         + 'your privacy and your soul :)');
        }

        $scope.register = function() {
            $scope.registerData.error = null;
            $scope.loginData.error = null;
            userService.createUser({
                email: $scope.registerData.email,
                fName: $scope.registerData.fName,
                lName: $scope.registerData.lName,
            }, function(error, password) {
                if (!error) {
                    window.alert('This is your new password,'
                                 + ' don\'t tell anyone!!\n\n' + password);
                    $scope.registerData.email = null;
                    $scope.registerData.fName = null;
                    $scope.registerData.lName = null;
                } else {
                    $scope.registerData.error = error.message.code === 11000
                        ? 'The email is already in use'
                        : 'Something went wrong in the server, we\'re sorry :(';
                }
            });
        }

        $scope.login = function() {
            $scope.registerData.error = null;
            $scope.loginData.error = null;
            sessionService.login($scope.loginData.email,
                                 $scope.loginData.password,
                                 $scope.loginData.remember,
                                 function(error, sessionData) {
                if (!error) $state.go('map');
                else $scope.login.error = true;
            });
            $scope.login.password = null;
        }

    }]);
