angular.module('PoisRUs').controller('AdminCtrl', [
    '$scope', 'userService',
    function($scope, userService) {

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