angular.module('PoisRUs').controller('MapCtrl', [
    '$scope', 'sessionService', 'poiService',
    function($scope, sessionService, poiService) {

        $scope.modalOpen = false;
        $scope.modalData = {};
        $scope.shownPois = [];

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
            $scope.poiModalOpen = true;
        }
        $scope.onRoutesButton = function() {
            $scope.openModal('Routes', 'Here go favourite routes, user\'s routes and followee\'s routes');
        }
        $scope.onAddButton = function() {
            $scope.openModal('Add new POI', 'Coming soon...');
        }

        poiService.getPois(function(err, data) {
            $scope.shownPois = data;
            $scope.allPois = data;
        });

        sessionService.getSession().then(function(session) {
            poiService.getUserPois(session.id, function(err, data) {
                $scope.userPois = data;
            });
            poiService.getFavouritePois(session.id, function(err, data) {
                $scope.favouritePois = data;
            });
            poiService.getFolloweePois(session.id, function(err, data) {
                $scope.followeePois = data;
            });
        });

    }]);
