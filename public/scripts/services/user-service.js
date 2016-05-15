angular.module('PoisRUs').service('userService', [
    '$http', '$resource', 'BaseRoutes', 'ApiRoutes',
    function($http, $resource, BaseRoutes, ApiRoutes) {

        var users = $resource(BaseRoutes.apiRoot + ApiRoutes.USERS)


        function createUser (userData, callback) {
            return users.save({
                email: userData.email,
                first_name: userData.fName,
                last_name: userData.lName
            }).$promise.then(
                function onSuccess(value, headers) {
                    if (callback) callback(null, value.password);
                },
                function onError(value, headers) {
                    if (callback) callback(value.data, null);
                });
        }

        // Service API
        return {
            createUser: createUser
        }

    }]);
