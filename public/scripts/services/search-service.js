angular.module('PoisRUs').service('searchService', [
    '$http', '$resource', 'BaseRoutes', 'ApiRoutes',
    function($http, $resource, BaseRoutes, ApiRoutes) {

        var Poi = $resource(BaseRoutes.apiRoot + ApiRoutes.SEARCH_POIS);

        var User = $resource(BaseRoutes.apiRoot + ApiRoutes.SEARCH_USERS);

        function searchPOIs(poiData, callback) {
            return Poi.get({data : poiData},
                function(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function (value, headers) {
                    if (callback) callback(value.data);
                });
        }

        function searchUsers(userData, callback) {
            return User.get({data : userData},
                function(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function (value, headers) {
                    if (callback) callback(value.data);
                });
        }

        // Service API
        return {
            searchPOIs: searchPOIs,
            searchUsers: searchUsers,
        }

    }]);
