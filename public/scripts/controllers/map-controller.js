angular.module('PoisRUs').controller('MapCtrl', [
    '$scope', 'ApiService',
    function($scope, ApiService) {

        $scope.modalOpen = false;
        $scope.modalData = {};

        $scope.openModal = function(title, body, footer) {
            $scope.modalData.title = title || 'Modal title';
            $scope.modalData.body = body || 'Modal body';
            $scope.modalData.footer = footer;
            $scope.modalOpen = true;
        }
        $scope.onSearchButton = function() {
            $scope.openModal('Search', 'No results yet');
        }
        $scope.onPoisButton = function() {
            $scope.openModal('POIs', 'Here go favourite POI\'s, user\'s POI\'s and followee\'s POI\'s');
        }
        $scope.onRoutesButton = function() {
            $scope.openModal('Routes', 'Here go favourite routes, user\'s routes and followee\'s routes');
        }
        $scope.onAddButton = function() {
            $scope.openModal('Add new POI', 'Coming soon...');
        }

    }]);
