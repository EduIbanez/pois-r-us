angular.module('PoisRUs').service('poiService', [
    '$http', '$resource', 'BaseRoutes', 'ApiRoutes',
    function($http, $resource, BaseRoutes, ApiRoutes) {

        var Poi = $resource(BaseRoutes.apiRoot + ApiRoutes.SINGLE_POI,
                            { poiId: '@id' },
                            {
                                update: { method: 'PUT' },
                                rate: { method: 'POST', url: BaseRoutes.apiRoot + ApiRoutes.POI_RATINGS }
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

        function createPoi(poiData, callback) {
            return Poi.save({
                name: poiData.name,
                description: poiData.description,
                fileUri: poiData.fileUri,
                lat: poiData.lat,
                lon: poiData.lon
            }).$promise.then(
                function onSuccess(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function onError(value, headers) {
                    if (callback) callback(value.data, null);
                });
        }

        function updatePoi(poiData, callback) {
            var data = new Poi({
                id: poiData.id,
                name: poiData.name || undefined,
                description: poiData.description || undefined,
                fileUri: poiData.fileUri || undefined,
                lat: poiData.lat || undefined,
                lon: poiData.lon || undefined
            });
            return Poi.update({ poiId: data.id }, data).$promise.then(
                function onSuccess(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function onError(value, headers) {
                    if (callback) callback(value.data, null);
                });
        }

        function deletePoi(poiId, callback) {
            return Poi.remove({ poiId: poiId }).$promise.then(
                function onSuccess(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function onError(value, headers) {
                    if (callback) callback(value.data, null);
                });
        }

        function ratePoi(poiId, rating, callback) {
            return Poi.rate({ poiId: poiId }, { score: rating }).$promise.then(
                function onSuccess(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function onError(value, headers) {
                    if (callback) callback(value.data, null);
                });
        }

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

        function likePoi(poiId, userId, callback) {
            return FavPoi.save({ userId: userId }, { poi: poiId }).$promise.then(
                function onSuccess(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function onError(value, headers) {
                    if (callback) callback(value.data, null);
                });
        }

        function dislikePoi(poiId, userId, callback) {
            return FavPoi.remove({ userId: userId,  poi: poiId }).$promise.then(
                function onSuccess(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function onError(value, headers) {
                    if (callback) callback(value.data, null);
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
            createPoi: createPoi,
            getPois: getPois,
            getUserPois: getUserPois,
            getFavouritePois: getFavouritePois,
            getFolloweePois: getFolloweePois,
            getMax: getMax,
            updatePoi: updatePoi,
            deletePoi: deletePoi,
            ratePoi: ratePoi,
            likePoi: likePoi,
            dislikePoi: dislikePoi,
        }

    }]);
