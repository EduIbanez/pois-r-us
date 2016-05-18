angular.module('PoisRUs').service('userService', [
    '$http', '$resource', 'BaseRoutes', 'ApiRoutes',
    function($http, $resource, BaseRoutes, ApiRoutes) {

        var User = $resource(
            BaseRoutes.apiRoot + ApiRoutes.SINGLE_USER,
            { userId: '@id' },
            {
                update: { method: 'PUT' }
            })


        function createUser(userData, callback) {
            return User.save({
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

        function getUserById(userId, callback) {
            return User.get({ userId: userId },
                            function(value, headers) {
                                if (callback) callback(null, value.message);
                            },
                            function (value, headers) {
                                if (callback) callback(value.data);
                            });
        }

        function updateUser(userData, callback) {
            var data = new User({
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

        function searchUser(userData, callback) {
            return User.get({ first_name: userData},
                function onSuccess (value, headers) {
                    if (callback) callback(null, value.message);
                },
                function onError (value, headers) {
                    if (callback) callback(value.data, null);
                });
        }

        function getUsers(callback) {
            return User.get(
                function(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function (value, headers) {
                    if (callback) callback(value.data);
                });
        }

        // Service API
        return {
            createUser: createUser,
            getUserById: getUserById,
            getUsers: getUsers,
            updateUser: updateUser,
            searchUser : searchUser
        }

    }]);
