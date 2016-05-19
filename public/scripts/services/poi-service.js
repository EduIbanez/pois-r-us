angular.module('PoisRUs').service('poiService', [
    '$http', '$resource', 'BaseRoutes', 'ApiRoutes',
    function($http, $resource, BaseRoutes, ApiRoutes) {

        var Poi = $resource(BaseRoutes.apiRoot + ApiRoutes.SINGLE_POI,
                            { poiId: '@id' },
                            {
                                update: { method: 'PUT' }
                            })
        var UserPoi = $resource(
            BaseRoutes.apiRoot + ApiRoutes.USER_POIS, { userId: '@id' })
        var FavPoi = $resource(
            BaseRoutes.apiRoot + ApiRoutes.USER_FAVOURITES, { userId: '@id' })
        var FollowPoi = $resource(
            BaseRoutes.apiRoot + ApiRoutes.USER_TIMELINE, { userId: '@id' })

        var Max = $resource(
            BaseRoutes.apiRoot + ApiRoutes.MAX,
            { poiId: '@id' })

        function getPois(callback) {
            return Poi.get(
                function(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function (value, headers) {
                    if (callback) callback(value.data);
                });
        }

        function getUserPois(userId, callback) {
            return UserPoi.get(
                { userId: userId },
                function(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function (value, headers) {
                    if (callback) callback(value.data);
                });
        }

        function getFavouritePois(userId, callback) {
            return FavPoi.get(
                { userId: userId },
                function(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function (value, headers) {
                    if (callback) callback(value.data);
                });
        }

        function getFolloweePois(userId, callback) {
            return FollowPoi.get(
                { userId: userId },
                function(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function (value, headers) {
                    if (callback) callback(value.data);
                });
        }

        function getMax(callback) {
            return Max.get(
                function(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function (value, headers) {
                    if (callback) callback(value.data);
                });
        }

        // Service API
        return {
            getPois: getPois,
            getUserPois: getUserPois,
            getFavouritePois: getFavouritePois,
            getFolloweePois: getFolloweePois,
            getMax: getMax,
            // getPOIById: getPOIById,
        }

    }]);