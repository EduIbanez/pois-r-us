angular.module('PoisRUs').service('poiService', [
    '$http', '$resource', 'BaseRoutes', 'ApiRoutes',
    function($http, $resource, BaseRoutes, ApiRoutes) {

        var Poi = $resource(
            BaseRoutes.apiRoot + ApiRoutes.POIS,
            { poiId: '@id' },
            {
                update: { method: 'PUT' }
            })


        function createPOI(userData, callback) {
            return Poi.save({
                email: userData.email,
                firstName: userData.fName,
                lastName: userData.lName
            }).$promise.then(
                function onSuccess(value, headers) {
                    if (callback) callback(null, value.password);
                },
                function onError(value, headers) {
                    if (callback) callback(value.data, null);
                });
        }

        function getPOIById(userId, callback) {
            return Poi.get({ userId: userId },
                function(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function (value, headers) {
                    if (callback) callback(value.data);
                });
        }

        function updatePOI(userData, callback) {
            var data = new Poi({
                id: userData.id,
                email: userData.email || undefined,
                firstName: userData.fName || undefined,
                lastName: userData.lName || undefined,
                password: userData.password || undefined
            })
            return User.update({ userId: data.id }, data).$promise.then(
                function onSuccess(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function onError(value, headers) {
                    if (callback) callback(value.data, null);
                });
        }

        function getPOIs(callback) {
            return Poi.get(
                function(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function (value, headers) {
                    if (callback) callback(value.data);
                });
        }

        // Service API
        return {
            createPOI: createPOI,
            getPOIById: getPOIById,
            getPOIs: getPOIs,
            updatePOI: updatePOI,
        }

    }]);
