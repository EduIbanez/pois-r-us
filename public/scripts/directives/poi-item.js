angular.module('PoisRUs').directive('poiItem', [
    'sessionService', 'userService', 'poiService',
    function(sessionService, userService, poiService) {
        return {
            replace: true,
            restrict: 'A',
            scope: {
                poi: '=',
                onLike: '&',
                onEdit: '&',
                onRemove: '&',
                onRate: '&',
                onDetails: '&',
            },
            template: `
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h4 class="panel-title">{{ poi.name }}</h4>
                    </div>
                    <div class="panel-body">
                        {{ poi.description }}<br>
                        <strong data-ng-if="poi.fileUri">
                            Media:&nbsp;
                        </strong>
                        <a href="{{ poi.fileUri }}">{{ poi.fileUri }}</a><br>
                        <strong>Rating:&nbsp;</strong>{{ poi.avgPunctuation }}<br>
                        <strong>Coordinates:&nbsp;</strong>{{ poi.lat }},&nbsp;{{ poi.lon }}
                    </div>
                    <div class="panel-footer">
                        <div class="btn-group">
                            <button class="btn btn-default"
                                    type="button"
                                    data-ng-click="onDetails({poi: poi})">
                                Find
                            </button>
                            <div class="btn-group" data-ng-if="loggedIn()" role="group">
                                <button class="btn btn-default btn-dropdown"
                                        type="button"
                                        data-toggle="dropdown">
                                    Rate
                                    <span class="caret"></span>
                                </button>
                                <ul class="dropdown-menu">
                                    <li data-ng-if="isOwned">
                                        <a data-ng-click="onRate({poi: poi, rating: 1})">1</a>
                                    </li>
                                    <li data-ng-if="isOwned">
                                        <a data-ng-click="onRate({poi: poi, rating: 2})">2</a>
                                    </li>
                                    <li data-ng-if="isOwned">
                                        <a data-ng-click="onRate({poi: poi, rating: 3})">3</a>
                                    </li>
                                    <li data-ng-if="isOwned">
                                        <a data-ng-click="onRate({poi: poi, rating: 4})">4</a>
                                    </li>
                                    <li data-ng-if="isOwned">
                                        <a data-ng-click="onRate({poi: poi, rating: 5})">5</a>
                                    </li>
                                </ul>
                            </div>
                            <div class="btn-group" data-ng-if="loggedIn()" role="group">
                                <button class="btn btn-default btn-dropdown"
                                        type="button"
                                        data-toggle="dropdown">
                                    Actions
                                    <span class="caret"></span>
                                </button>
                                <ul class="dropdown-menu">
                                    <li data-ng-if="isOwned">
                                        <a data-ng-click="onEdit({poi: poi})">Edit</a>
                                    </li>
                                    <li data-ng-if="isOwned">
                                        <a data-ng-click="onRemove({poi: poi})">Delete</a>
                                    </li>
                                    <li><a data-ng-click="onLike({poi: poi, value: !isFavourite})">
                                        {{ isFavourite ? "Don\'t like" : "Like" }}
                                    </a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                `,
            link: function(scope, element, attrs) {
                scope.isOwned = false;
                scope.isFavourite = false;
                sessionService.getSession().then(function(session) {
                    scope.isOwned = session.id == scope.poi.ownerId;
                    poiService.getFavouritePois(session.id, function(err, data) {
                        scope.isFavourite =
                            // data.favourites.indexOf(scope.poi.id) !== -1;
                            data.map(function(itm) { return itm.id }).indexOf(scope.poi.id) !== -1;
                    });
                });
                scope.loggedIn = function() { return sessionService.isLoggedIn(); }
            }
        }
    }]);
