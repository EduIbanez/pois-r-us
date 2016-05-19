angular.module('PoisRUs').controller('StatsCtrl', [
    '$scope', 'userService', 'poiService',
    function($scope, userService, poiService) {

        $scope.mostrar = "12";
        $scope.mostrar2 = "12";
        var fecha=new Date();
        var manana=new Date(fecha.getTime() + 24*60*60*1000);
        var ayer=new Date(fecha.getTime() - 24*60*60*1000);
        $scope.primero = "12";
        $scope.segundo = "22";
        $scope.tercero = "32";
        $scope.todos = "32";
        $scope.users = "32";

        $scope.cargarUsers = function() {
            userService.searchFecha("as",function(error, data) {
                if (!error) {
                    $scope.primero = data.length;
                    $scope.data = [
                        [$scope.primero, $scope.segundo, $scope.tercero]
                    ];
                }
                else {
                    $scope.mostrar = (error);
                }
            });
        }

        $scope.cargarUsers2 = function() {
            userService.searchFecha("as",function(error, data) {
                if (!error) {
                    $scope.segundo = data.length;
                    $scope.data = [
                        [$scope.primero, $scope.segundo, $scope.tercero]
                    ];
                }
                else {
                    $scope.mostrar = (error);
                }
            });
        }

        $scope.cargarUsers3 = function() {
            userService.searchFecha("as",function(error, data) {
                if (!error) {
                    $scope.tercero = data.length;
                    $scope.data = [
                        [$scope.primero, $scope.segundo, $scope.tercero]
                    ];
                }
                else {
                    $scope.mostrar = (error);
                }
            });
        }

        $scope.allUsers = function() {
            userService.getUsers(function(error, data) {
                if (!error) {
                    $scope.users = $scope.todos/data.length;
                    $scope.data2 = [
                        [$scope.todos, $scope.users]
                    ];
                }
                else {
                    $scope.mostrar = (error);
                }
            });
        }

        $scope.allPOIS = function() {
            poiService.getPOIs(function(error, data) {
                if (!error) {
                    $scope.todos = data.length;
                    $scope.data = [
                        [$scope.todos, $scope.users]
                    ];
                }
                else {
                    $scope.mostrar = (error);
                }
            });
        }

        $scope.Max = function() {
            poiService.getMax(function(error, data) {
                if (!error) {
                    $scope.mostrar = data;
                    /*$scope.todos = data.length;
                    $scope.data = [
                        [$scope.todos, $scope.users]
                    ];*/
                }
                else {
                    $scope.mostrar = (error);
                }
            });
        }

        $scope.init = function() {
            $scope.cargarUsers();
            $scope.cargarUsers2();
            $scope.cargarUsers3();
            $scope.allPOIS();
            $scope.allUsers();
            $scope.Max();
        }

        $scope.labels = [ayer.toJSON().slice(0,10), fecha.toJSON().slice(0,10), manana.toJSON().slice(0,10)];
        $scope.labels2 = ["POIs totales", "POIs por usuario"];
        $scope.onChartClick = function (points, evt) {
            console.log(points, evt);
        };
    }]);
