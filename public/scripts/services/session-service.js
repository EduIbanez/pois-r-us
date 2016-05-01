angular.module('PoisRUs').service('userService', [

    function() {

        var session = JSON.parse(localStorage.getItem('authInfo'));

        return {
            isLoggedIn: function() { return session !== null; },
            getUserId: function() { return session.id; },
            getUserName: function() { return session.username; },
            logIn: function(username, password) {
                session = { id: 'dummyID', username: username };
                localStorage.setItem('authInfo', JSON.stringify(session));
            },
            logOut: function() {
                session = null;
                localStorage.removeItem('authInfo');
            }
        }

    }]);
