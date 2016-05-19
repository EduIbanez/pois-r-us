angular.module('PoisRUs').controller('StatsCtrl', [
    '$scope', 'userService', 'poiService',
    function($scope, userService, poiService) {

        $scope.mostrar = "12";
        $scope.mostrar2 = "12";
        $scope.mostrar3 = "12";
        $scope.labels3 = ["más votado"];
        $scope.labels4 = ["más valorado"];
        $scope.labels5 = ["usuario con más POIs"];
        $scope.options = {
            responsive: true,
            maintainAspectRatio: true,
            barDatasetSpacing: 1,
            barShowStroke: true,
            barStrokeWidth : 2,
            barValueSpacing : 5
        };

        $scope.Max = function() {
            poiService.getMax(function(error, data) {
                if (!error) {
                    $scope.data3 = [
                        [data[0].numberOfVotes, data[1].numberOfVotes, data[2].numberOfVotes]
                    ];
                    $scope.labels3 = [data[0].name, data[1].name, data[2].name];
                }
                else {
                    $scope.mostrar = (error);
                }
            });
        };

        $scope.MaxP = function() {
            poiService.getMaxa(function(error, data) {
                if (!error) {
                    $scope.data4 = [
                        [data[0].avgPunctuation, data[1].avgPunctuation, data[2].avgPunctuation]
                    ];
                    $scope.labels4 = [data[0].name, data[1].name, data[2].name];
                }
                else {
                    $scope.mostrar = (error);
                }
            });
        };

        $scope.More = function() {
            poiService.getMore(function(error, data) {
                if (!error) {
                    $scope.data5 = [
                        [data[0].total]
                    ];
                    $scope.labels5 = [data[0]._id];
                }
                else {
                    $scope.mostrar = (error);
                }
            });
        };

        $scope.MoreS = function() {
            userService.getMoreS(function(error, data) {
                if (!error) {
                    $scope.data6 = [
                        [data[0].total]
                    ];
                    $scope.labels6 = [data[0]._id];
                }
                else {
                    $scope.mostrar = (error);
                }
            });
        };

        $scope.MoreF = function() {
            userService.getMoreF(function(error, data) {
                if (!error) {
                    $scope.data7 = [
                        [data[0].total]
                    ];
                    $scope.labels7 = [data[0]._id];
                }
                else {
                    $scope.mostrar = (error);
                }
            });
        };

        $scope.init = function() {
            $scope.Max();
            $scope.MaxP();
            $scope.More();
            $scope.MoreF();
            $scope.MoreS();
        }

        $scope.onChartClick = function (points, evt) {
            console.log(points, evt);
        };
    }]);
