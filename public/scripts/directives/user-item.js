angular.module('PoisRUs').directive('userItem', [
    'sessionService', 'userService', 'poiService',
    function(sessionService, userService, poiService) {
        return {
            replace: true,
            restrict: 'A',
            scope: {
                user: '=',
                onFollow: '&',
            },
            template: `
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h4 class="panel-title">{{ user.firstName }}&nbsp;{{ user.lastName }}</h4>
                    </div>
                    <div class="panel-footer">
                        <button class="btn btn-default"
                                type="button"
                                data-ng-if="loggedIn()"
                                data-ng-click="onFollow({user: user, value: !isFollowed})">
                            {{ isFollowed ? "Stop following" : "Follow" }}
                        </button>
                    </div>
                </div>
                `,
            link: function(scope, element, attrs) {
                scope.isFollowed = false;
                sessionService.getSession().then(function(session) {
                    // userService.getFollowers(session.id, function(err, data) {
                        // scope.isFollowed =
                            // data.map(function(itm) { return itm.id })
                                // .indexOf(scope.user.id) !== -1;
                    // });
                });
                scope.loggedIn = function() { return sessionService.isLoggedIn(); }
            }
        }
    }]);
