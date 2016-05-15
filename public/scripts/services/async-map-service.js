window._mapLoader = {
    callbacks: [],
    onLoad: function() {
        for (var i = 0; i < this.callbacks.length; i++) this.callbacks[i]();
    }
}

angular.module('PoisRUs').factory('asyncGoogleMapsService', [
    function() {
        var _map;
        return {
            getLibrary: function(callback) {
                var _cbWrapper = function() { callback(window.google.maps); };
                if (window.google && window.google.maps) _cbWrapper();
                else window._mapLoader.callbacks.push(_cbWrapper);
            }
        }
    }]);
