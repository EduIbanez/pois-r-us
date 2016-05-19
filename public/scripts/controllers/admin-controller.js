angular.module('PoisRUs').controller('AdminCtrl', [
    '$scope', '$state', 'userService', 'sessionService',
    function($scope, $state, userService, sessionService) {

        sessionService.getSession().then(
            function(session) {
                console.log(session);
                if (!session.isAdmin) $state.go('map');
            },
            function() { $state.go('login'); }
        );

        $scope.mostrar = "pulse el botón para mostrar los usuarios en el servidor";

        $scope.mostrarUsers = function() {
            userService.getUsers(function(error, data) {
                if (!error) {
                    //$scope.mostrar = [];
                    $scope.mostrar = (data);
                }
                else {
                    $scope.mostrar.push(error);
                }
            });
        }
    }]);
