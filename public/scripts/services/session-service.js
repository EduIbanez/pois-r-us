angular.module('PoisRUs').service('sessionService', [
    '$http', '$resource', 'BaseRoutes', 'ApiRoutes',
    function($http, $resource, BaseRoutes, ApiRoutes) {

        var STORAGE_KEY = 'AUTH_INFO';
        var Auth = $resource(BaseRoutes.apiRoot + ApiRoutes.AUTH)

        var session = null;

        // Try to recover session from localstorage and revalidate it
        var _session = JSON.parse(localStorage.getItem(STORAGE_KEY));
        var _sessionPromise = null;
        if (_session) _sessionPromise = login(_session.email, _session.password);

        function login (email, password, remember, callback) {
            console.log(email, password);
            $http.defaults.headers.common['Authorization'] = 
                    'Basic ' + btoa(email + ':' + password)
            return Auth.get().$promise.then(
                function onSuccess(value, headers) {
                    session = value.message;
                    session.password = password;
                    if (remember) {
                        window.localStorage.setItem(STORAGE_KEY,
                                                    JSON.stringify(session));
                    }
                    if (callback) callback(null, session);
                    return session;
                },
                function onError(value, headers) {
                    $http.defaults.headers.common['Authorization'] = undefined;
                    session = null;
                    window.localStorage.removeItem(STORAGE_KEY);
                    if (callback) callback(value.data.error, null);
                    return null;
                });
        }

        function logout() {
            session = null;
            window.localStorage.removeItem(STORAGE_KEY);
            $http.defaults.headers.common['Authorization'] = undefined;
        }
        
        // Service API
        return {
            isLoggedIn: function() { return session && session.id; },
            getSession: function() {
                if (_sessionPromise)
                    return new Promise(function(resolve, reject) {
                        _sessionPromise.then(resolve).catch(reject);
                    });
                else if (session) return Promise.resolve(session);
                else return Promise.reject(null);
            },
            login: login,
            logout: logout
        }

    }]);
