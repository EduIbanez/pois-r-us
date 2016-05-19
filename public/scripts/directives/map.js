angular.module('PoisRUs').directive('map', [
    'asyncGoogleMapsService',
    function(asyncGoogleMapsService) {
        return {
            replace: true,
            restrict: 'A',
            scope: {
                pois: '='
            },
            template: '<div id="map"></div>',
            link: function(scope, element, attrs) {
                var mapDiv = element[0];
                var markers = [];
                var map = null;
                scope.$watch('pois', function(newVal, oldVal) {
                    asyncGoogleMapsService.getLibrary(function(gmaps) {
                        for(var i = 0; i < markers.length; i++) {
                            markers[i].setMap(null);
                        }
                        markers = [];
                        for(var i = 0; i < scope.pois.length; i++) {
                            markers.push(new gmaps.Marker({
                                title: scope.pois[i].name,
                                position: {
                                    lat: scope.pois[i].lat,
                                    lng: scope.pois[i].lon
                                },
                                map: map
                            }));
                        }
                    });
                }, true);
                asyncGoogleMapsService.getLibrary(function(gmaps) {
                    map = new gmaps.Map(mapDiv, {
                        center: { lat: 41.6529866, lng: -0.8948288 },
                        mapTypeControl: false,
                        streetViewControl: false,
                        zoomControlOptions: {
                            position: gmaps.ControlPosition.LEFT_BOTTOM
                        },
                        zoom: 15
                    });
                });
            }
        }
    }]);
