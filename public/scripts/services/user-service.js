angular.module('PoisRUs').service('userService', [
    '$http', '$resource', 'BaseRoutes', 'ApiRoutes',
    function($http, $resource, BaseRoutes, ApiRoutes) {

        var User = $resource(
            BaseRoutes.apiRoot + ApiRoutes.SINGLE_USER,
            { userId: '@id' },
            {
                update: { method: 'PUT' }
            })

		var Fecha = $resource(
            BaseRoutes.apiRoot + ApiRoutes.FECHA,
            { fecha: '@created_at' });

        var MoreF = $resource(
            BaseRoutes.apiRoot + ApiRoutes.FAV,
            { fecha: '@first_name' });

        var MoreS = $resource(
            BaseRoutes.apiRoot + ApiRoutes.FOLLOW,
            { fecha: '@first_name' });

        var Followers = $resource(
            BaseRoutes.apiRoot + ApiRoutes.USER_FOLLOWERS,
            { userId: '@id' },
            {
                update: { method: 'PUT' }
            })

        var Followees = $resource(
            BaseRoutes.apiRoot + ApiRoutes.USER_FOLLOWEES,
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

        function searchFecha(userData, callback) {
            return Fecha.get({ fecha : userData},
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

        function getMoreS(callback) {
            return MoreS.get(
                function(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function (value, headers) {
                    if (callback) callback(value.data);
                });
        }

        function getMoreF(callback) {
            return MoreF.get(
                function(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function (value, headers) {
                    if (callback) callback(value.data);
                });
        }

        function getMoreF(callback) {
            return MoreF.get(
                function(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function (value, headers) {
                    if (callback) callback(value.data);
                });
        }

        function getMoreF(callback) {
            return MoreF.get(
                function(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function (value, headers) {
                    if (callback) callback(value.data);
                });
        }

        function getFollowers(userData, callback) {
            return Followers.get({userId : userData},
                function(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function (value, headers) {
                    if (callback) callback(value.data);
                });
        }

        function getFollowees(userData, callback) {
            return Followees.get({userId : userData},
                function(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function (value, headers) {
                    if (callback) callback(value.data);
                });
        }

        function follow(followee, userId, callback) {
            return Followees.save({ userId: userId }, { followee: followee }).$promise.then(
                function onSuccess(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function onError(value, headers) {
                    if (callback) callback(value.data, null);
                });
        }

        function unfollow(followee, userId, callback) {
            return Followees.remove({ userId: userId,  followee: followee }).$promise.then(
                function onSuccess(value, headers) {
                    if (callback) callback(null, value.message);
                },
                function onError(value, headers) {
                    if (callback) callback(value.data, null);
                });
        }

        // Service API
        return {
            createUser: createUser,
            getUserById: getUserById,
            getUsers: getUsers,
            updateUser: updateUser,
            searchFecha : searchFecha,
            getMoreF : getMoreF,
            getMoreS : getMoreS,
            getFollowees : getFollowees,
            getFollowers : getFollowers,
            follow : follow,
            unfollow : unfollow,

        }

    }]);
