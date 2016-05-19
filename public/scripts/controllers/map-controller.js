angular.module('PoisRUs').controller('MapCtrl', [
    '$scope', 'sessionService', 'poiService', 'searchService',
    function($scope, sessionService, poiService, searchService) {

        $scope.modalOpen = false;
        $scope.modalData = {};
        $scope.shownPois = [];
        $scope.center = { lat: 41.666666, lon: -0.888938 }

        $scope.openModal = function(title, body, footer) {
            $scope.modalData.title = title || 'Modal title';
            $scope.modalData.body = body || 'Modal body';
            $scope.modalData.footer = footer;
            $scope.modalOpen = true;
        }
        $scope.onSearchButton = function() {
            $scope.searchModalOpen = true;
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

        $scope.onEdit = function(poi) {
            $scope.selectedPoi = poi;
            $scope.poiModalOpen = false;
            $scope.editModalOpen = true;
        }

        $scope.onRemove = function(poi) {
            sessionService.getSession().then(function(session) {
                poiService.deletePoi(poi.id, function(err, data) {
                    if (err) window.alert('There was an error', err);
                    else {
                        loadPois();
                        window.alert('POI was successfully removed');
                    }
                });
            }).catch(function(err) { console.log('Not allowed to remove'); });
        }

        $scope.onRate = function(poi, rating) {
            sessionService.getSession().then(function(session) {
                poiService.ratePoi(poi.id, rating, function(err, data) {
                    if (err) window.alert('There was an error', err);
                    else {
                        loadPois();
                        window.alert('POI was successfully rated');
                    }
                });
            }).catch(function(err) { console.log('Not allowed to rate'); });
        }

        $scope.onLike = function(poi, value) {
            sessionService.getSession().then(function(session) {
                if (value) {
                    poiService.likePoi(poi.id, session.id, function(err, data) {
                        if (err) window.alert('There was an error', err);
                        else {
                            loadPois();
                            window.alert('Now you like the POI');
                        }
                    });
                } else {
                    poiService.dislikePoi(poi.id, session.id, function(err, data) {
                        if (err) window.alert('There was an error', err);
                        else {
                            loadPois();
                            window.alert('Now you don\'t like the POI');
                        }
                    });
                }
            }).catch(function(err) { console.log('Not allowed to like', err); });
        }

        $scope.savePoi = function() {
            sessionService.getSession().then(function(session) {
                if ($scope.selectedPoi.id) {
                    poiService.updatePoi($scope.selectedPoi, function(err, data) {
                        if (err) window.alert('There was an error', err);
                        else {
                            loadPois();
                            window.alert('POI was successfully updated');
                            $scope.editModalOpen = false;
                        }
                    });
                } else {
                    poiService.createPoi($scope.selectedPoi, function(err, data) {
                        if (err) window.alert('There was an error', err);
                        else {
                            loadPois();
                            window.alert('POI was successfully created');
                            $scope.editModalOpen = false;
                        }
                    });
                }
            }).catch(function(err) { console.log('Not allowed to save'); });
        };

        $scope.selectPoi = function(poi) {
            $scope.center = { lat: poi.lat, lon: poi.lon };
            $scope.zoom = 20;
        };

        $scope.searchResults = {
            query: null, // HACK: this should not be here, but breaks scope if not under an object
            pois: [],
            users: []
        };
        $scope.search = function() {
            searchService.searchPOIs($scope.searchResults.query, function(err, data) {
                if (err) console.log(err);
                else $scope.searchResults.pois = data;
            });
            searchService.searchUsers($scope.searchResults.query, function(err, data) {
                if (err) console.log(err);
                else $scope.searchResults.users = data;
            });
        };

        function loadPois() {
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
        };

        loadPois();
    }]);
