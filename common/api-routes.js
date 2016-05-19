// =============================================================================
//  This file defines the API routes.
// -----------------------------------------------------------------------------
//  Note that this file is common to the server and the client, so the routes
//  only have to be defined once. Any changes done to this file will have
//  effect both in the backend and the frontend at the same time.
// =============================================================================

/* API ENDPOINTS DEFINITION */
// -----------------------------------------------------------------------------

var _apiDefinition = {
    AUTH            : '/auth',
    USERS           : '/users',
    SINGLE_USER     : '/users/:userId',
    USER_FAVOURITES : '/users/:userId/favourites',
    USER_FOLLOWEES  : '/users/:userId/following',
    USER_TIMELINE   : '/users/:userId/following/pois',
    USER_FOLLOWERS  : '/users/:userId/followers',
    USER_POIS       : '/users/:userId/pois',
	FECHA           : '/users/fecha/:fecha',
    POIS            : '/pois',
    MAX             : '/max',
    SINGLE_POI      : '/pois/:poiId',
    POI_RATINGS     : '/pois/:poiId/ratings',
    ROUTES          : '/routes',
    SINGLE_ROUTE    : '/routes/:routeId'
}

/* EXPORT */
// -----------------------------------------------------------------------------

var usingAngular = typeof angular !== 'undefined'
var usingNode    = typeof module !== 'undefined' && module.exports;

if (usingAngular) {
    angular.module('PoisRUs').constant('ApiRoutes', _apiDefinition);
} else if (usingNode) {
    module.exports = _apiDefinition;
} else {
    window.API_DEFINITION = _apiDefinition;
}