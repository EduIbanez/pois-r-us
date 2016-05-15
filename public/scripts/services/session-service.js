angular.module('PoisRUs').service('sessionService', [
    '$http', '$resource', 'BaseRoutes', 'ApiRoutes',
    function($http, $resource, BaseRoutes, ApiRoutes) {

        var STORAGE_KEY = 'AUTH_INFO';
        var auth = $resource(BaseRoutes.apiRoot + ApiRoutes.AUTH)

        var session = null;

        function login (email, password, remember, callback) {
            $http.defaults.headers.common['Authorization'] = 
                    'Basic ' + btoa(email + ':' + password)
            return auth.get().$promise.then(
                function onSuccess(value, headers) {
                    session = value.message;
                    session.password = password;
                    if (remember) {
                        window.localStorage.setItem(STORAGE_KEY,
                                                    JSON.stringify(session));
                    }
                    if (callback) callback(null, session);
                },
                function onError(value, headers) {
                    $http.defaults.headers.common['Authorization'] = undefined;
                    session = null;
                    window.localStorage.removeItem(STORAGE_KEY);
                    if (callback) callback(value.data.error, null);
                });
        }

        function logout() {
            session = null;
            window.localStorage.removeItem(STORAGE_KEY);
            $http.defaults.headers.common['Authorization'] = undefined;
        }

        // Try to recover session from localstorage and revalidate it
        var _session = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (_session) login(_session.email, _session.password);
        
        // Service API
        return {
            isLoggedIn: function() { return session && session.id; },
            getUserId: function() { return session.id; },
            getUserName: function() {
                return session.firstName + session.lastName;
            },
            login: login,
            logout: logout
        }

    }]);
