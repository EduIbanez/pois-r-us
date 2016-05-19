angular.module('PoisRUs').controller('StatsCtrl', [
    '$scope', 'userService', 'poiService',
    function($scope, userService, poiService) {

        $scope.mostrar3 = "12";
        $scope.mostrar4 = "12";
        $scope.mostrar5 = "12";
        $scope.mostrar6 = "12";
        $scope.mostrar7 = "12";
        $scope.data3 = [12];
        $scope.data4 = [12];
        $scope.data5 = [12];
        $scope.data6 = [12];
        $scope.data7 = [12];
        $scope.labels3 = ["más votado"];
        $scope.labels4 = ["más valorado"];
        $scope.labels5 = ["usuario con más POIs"];
        $scope.labels6 = ["más votado"];
        $scope.labels7 = ["más valorado"];
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
                if (!error && data.length>=3) {
                    $scope.mostrar3 = data[0].numberOfVotes;
                    $scope.data3 = [
                        [data[0].numberOfVotes, data[1].numberOfVotes, data[2].numberOfVotes]
                    ];
                    $scope.labels3 = [data[0].name, data[1].name, data[2].name];
                }
                else {
                    $scope.data3 = [
                        0
                    ];
                    $scope.labels3 = ["no hay 3 POIs"];
                }
            });
        };

        $scope.MaxP = function() {
            poiService.getMaxa(function(error, data) {
                if (!error && data.length>=3) {
                    $scope.mostrar4 = data[0].avgPunctuation;
                    $scope.data4 = [
                        [data[0].avgPunctuation, data[1].avgPunctuation, data[2].avgPunctuation]
                    ];
                    $scope.labels4 = [data[0].name, data[1].name, data[2].name];
                }
                else {
                    $scope.data4 = [
                        0
                    ];
                    $scope.labels4 = ["no hay 3 POIs"];
                }
            });
        };

        $scope.More = function() {
            poiService.getMore(function(error, data) {
                if (!error && data.length>=1) {
                    $scope.mostrar5 = data[0].total;
                    $scope.data5 = [
                        [data[0].total]
                    ];
                    $scope.labels5 = [data[0]._id];
                }
                else {
                    $scope.data5 = [
                        0
                    ];
                    $scope.labels5 = ["no hay POIs"];
                }
            });
        };

        $scope.MoreS = function() {
            userService.getMoreS(function(error, data) {
                if (!error && data.length>=1) {
                    $scope.mostrar6 = data[0].total;
                    $scope.data6 = [
                        [data[0].total]
                    ];
                    $scope.labels6 = [data[0]._id];
                }
                else {
                    $scope.data6 = [
                        0
                    ];
                    $scope.labels6 = ["no hay POIs"];
                }
            });
        };

        $scope.MoreF = function() {
            userService.getMoreF(function(error, data) {
                if (!error) {
                    $scope.mostrar7 = data[0].size;
                    $scope.data7 = [
                        [data[0].size]
                    ];
                    $scope.labels7 = [data[0]._id];
                }
                else {
                    $scope.data7 = [
                        0
                    ];
                    $scope.labels7 = ["no hay POIs"];
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
