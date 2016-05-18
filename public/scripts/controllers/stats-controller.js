angular.module('PoisRUs').controller('StatsCtrl', function($scope) {
    $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
    $scope.data1 = [300, 500, 100];
    $scope.options = {responsive: false}

    $scope.labels2 = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    $scope.data2 = [[65, 59, 80, 81, 56, 55, 40]];
    $scope.colors = ['#00FF00', '#00FF00'];
    });