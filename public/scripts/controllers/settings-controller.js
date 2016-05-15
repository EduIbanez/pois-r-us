angular.module('PoisRUs').controller('SettingsCtrl', [
    '$scope', '$state', 'sessionService', 'userService',
    function($scope, $state, sessionService, userService) {

        $scope.userData = {
            id: null,
            email: null,
            fName: null,
            lName: null,
            password: null,
            rePasswd: null,
            error: null
        };

        $scope.placeholders = {};

        sessionService.getSession().then(
            function(session) {
                userService.getUserById(session.id, function(err, data) {
                    $scope.userData.id = session.id;
                    $scope.placeholders.email = data.email;
                    $scope.placeholders.firstName = data.firstName;
                    $scope.placeholders.lastName = data.lastName;
                });
            },
            function() { $state.go('login'); }
        );

        $scope.updateInfo = function() {
            $scope.userData.error = null;
            if ($scope.userData.password === $scope.userData.rePasswd) {
                userService.updateUser({
                    id: $scope.userData.id,
                    email: $scope.userData.email || undefined,
                    fName: $scope.userData.fName || undefined,
                    lName: $scope.userData.lName || undefined,
                    password: $scope.userData.password || undefined
                }, function(error, data) {
                    if (!error) {
                        // Update session with new credentials
                        if ($scope.userData.email || $scope.userData.password) {
                            window.alert('Update successful! Please, login again');
                            sessionService.logout();
                            $state.go('login');
                        }
                        // Clean form
                        $scope.placeholders.email = data.email;
                        $scope.placeholders.firstName = data.firstName;
                        $scope.placeholders.lastName = data.lastName;
                        $scope.userData.email = null;
                        $scope.userData.fName = null;
                        $scope.userData.lName = null;
                        $scope.userData.password = null;
                        $scope.userData.rePasswd = null;
                        $scope.userData.success = true;
                    } else {
                        $scope.userData.error = error.message.code === 11000
                            ? 'The email is already in use'
                            : 'Something went wrong in the server, we\'re sorry :(';
                    }
                });
            } else $scope.userData.error = 'Passwords don\'t match';
        }

        // $scope.login = function() {
            // $scope.registerData.error = null;
            // $scope.loginData.error = null;
            // sessionService.login($scope.loginData.email,
                                 // $scope.loginData.password,
                                 // $scope.loginData.remember,
                                 // function(error, sessionData) {
                // if (!error) $state.go('map');
                // else $scope.login.error = true;
            // });
            // $scope.login.password = null;
        // }

    }]);
