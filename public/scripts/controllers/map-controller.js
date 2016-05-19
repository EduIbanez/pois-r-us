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
            $scope.selectedPoi = {
                name: null,
                description: null,
                lat: null,
                lon: null,
                mediaUri: null
            }
            $scope.editModalOpen = true;
        }

        $scope.savePoi = function() {
            sessionService.getSession().then(function(session) {
                poiService.createPoi($scope.selectedPoi, function(err, data) {
                    if (err) window.alert('There was an error', err);
                    else {
                        window.alert('POI was successfully created');
                        $scope.userPois.push(data);
                        $scope.allPois.push(data);
                        $scope.editModalOpen = false;
                    }
                });
            }).catch(function(err) { console.log('Not allowed to save'); });
        };

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
