angular.module('PoisRUs').directive('map', [
    'asyncGoogleMapsService',
    function(asyncGoogleMapsService) {
        return {
            replace: true,
            restrict: 'A',
            template: '<div id="map"></div>',
            link: function(scope, element, attrs) {
                var mapDiv = element[0]
                asyncGoogleMapsService.getLibrary(function(gmaps) {
                    var map = new gmaps.Map(mapDiv, {
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
