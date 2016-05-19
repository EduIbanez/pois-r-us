angular.module('PoisRUs').directive('map', [
    'asyncGoogleMapsService',
    function(asyncGoogleMapsService) {
        return {
            replace: true,
            restrict: 'A',
            scope: {
                pois: '=',
                center: '=',
                zoom: '='
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
                            var marker = new gmaps.Marker({
                                title: scope.pois[i].name,
                                position: {
                                    lat: scope.pois[i].lat,
                                    lng: scope.pois[i].lon
                                },
                                map: map
                            });
                            markers.push(marker);
                            // FIXME: Only works for the first marker
                            var content = '<h4>' + scope.pois[i].name + '</h4>'
                                + '<p>'
                                    + scope.pois[i].description
                                    + '<br><strong>Rating:&nbsp</strong>'
                                    + scope.pois[i].avgPunctuation
                                    + '<br><strong>Coordinates:&nbsp</strong>'
                                    + scope.pois[i].lat + ', ' + scope.pois[i].lon
                                    + (scope.pois[i].fileUri
                                        ? '<br><strong>Media:&nbsp</strong><a href="'
                                           + scope.pois[i].fileUri
                                           + '">' + scope.pois[i].fileUri
                                           + '</a>'
                                        : '')
                                + '</p>';
                            var infoWindow = new gmaps.InfoWindow({
                                content: content
                            });
                            marker.addListener('click', function() {
                                infoWindow.open(map, marker);
                            });
                        }
                    });
                }, true);
                scope.$watch('center', function(newVal, oldVal) {
                    asyncGoogleMapsService.getLibrary(function(gmaps) {
                        if (newVal && newVal.lat !== undefined
                                && newVal.lon !== undefined)
                            map.setCenter({ lat: newVal.lat, lng: newVal.lon });
                            scope.center = null;
                        if (scope.zoom !== undefined) map.setZoom(scope.zoom);
                    });
                }, true);
                scope.$watch('zoom', function(newVal, oldVal) {
                    asyncGoogleMapsService.getLibrary(function(gmaps) {
                        if (newVal !== undefined) map.setZoom(newVal);
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
