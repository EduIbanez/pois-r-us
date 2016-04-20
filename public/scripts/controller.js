var app = angular.module('PoisRUs');

app.controller('HomeCtrl', function($scope, ApiService) {

    $scope.data = { loadedFromAPI: '---' }

    $scope.loadFromAPI = function() {
        $scope.data.loadedFromAPI = ApiService.getGreeting();
    }
});
