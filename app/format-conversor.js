// =============================================================================
//  This file defines the function that act as a conversor between the data
//  format in the API and the data format in the database.
// =============================================================================

function userDBtoAPI(userData) {
    var _transformedData = {};
    if (userData._id) {
        _transformedData.id = userData._id;
        _transformedData.url = '/api/users/' + userData._id;
    }
    if (userData.first_name) _transformedData.firstName = userData.first_name;
    if (userData.last_name) _transformedData.lastName = userData.last_name;
    if (userData.email) _transformedData.email = userData.email;
    if (userData.created_at) _transformedData.joinedAt = userData.created_at;
    if (userData.is_admin) _transformedData.isAdmin = userData.is_admin;
    if (userData.fav_pois) _transformedData.favPois = userData.fav_pois;
    if (userData.ruta) _transformedData.ruta = userData.ruta;
    _transformedData.pois = '/api/users/' + userData._id + '/pois';
    _transformedData.following = '/api/users/' + userData._id + '/following';
    _transformedData.favourites = '/api/users/' + userData._id + '/favourites';
    return _transformedData;
}

function userAPItoDB(userData) {
    var _transformedData = {};
    if (userData.id) _transformedData._id = userData.id;
    if (userData.firstName) _transformedData.first_name = userData.firstName;
    if (userData.lastName) _transformedData.last_name = userData.lastName;
    if (userData.email) _transformedData.email = userData.email;
    if (userData.password) _transformedData.password = userData.password;
    if (userData.favPois) _transformedData.fav_pois = userData.favPois;
    if (userData.ruta) _transformedData.ruta = userData.ruta;
    if (userData.following) _transformedData.followees = userData.following;
    if (userData.favourites) _transformedData.favourites = userData.favourites;
    return _transformedData;
}

function poiDBtoAPI(poiData) {
    var _transformedData = {};
    if (poiData.name) _transformedData.name = poiData.name;
    if (poiData.description) _transformedData.description = poiData.description;
    if (poiData._id) {
        _transformedData.id = poiData._id;
        _transformedData.url = '/api/pois/' + poiData._id;
    }
    if (poiData.owner_id) {
        _transformedData.ownerId = poiData.owner_id;
        _transformedData.ownerUrl = '/api/users/' + poiData.owner_id;
    }
    if (poiData.coordinates) {
        _transformedData.lat = poiData.coordinates.lat;
        _transformedData.lon = poiData.coordinates.lon;
    }
    if (poiData.file_uri) _transformedData.fileUri = poiData.file_uri;
    if (poiData.avg_punctuation)
        _transformedData.avgPunctuation = poiData.avg_punctuation;
    if (poiData.number_of_votes)
        _transformedData.numberOfVotes = poiData.number_of_votes;
    if (poiData.created_at) _transformedData.createdAt = poiData.created_at;
    return _transformedData;
}

function poiAPItoDB(poiData) {
    var _transformedData = { coordinates: {} };
    if (poiData.id) _transformedData._id = poiData.id;
    if (poiData.ownerId) _transformedData.owner_id = poiData.ownerId;
    if (poiData.name) _transformedData.name = poiData.name;
    if (poiData.description) _transformedData.description = poiData.description;
    if (poiData.lat) _transformedData.coordinates.lat = poiData.lat;
    if (poiData.lon) _transformedData.coordinates.lon = poiData.lon;
    if (poiData.fileUri) _transformedData.file_uri = poiData.fileUri;
    if (poiData.avgPunctuation)
        _transformedData.avg_punctuation = poiData.avgPunctuation;
    if (poiData.numberOfVotes)
        _transformedData.number_of_votes = poiData.numberOfVotes;
    return _transformedData;
}

function routeDBtoAPI(routeData) {
    var _transformedData = {};
    if (routeData.name) _transformedData.name = routeData.name;
    if (routeData.pois) _transformedData.pois = routeData.pois;
    if (routeData._id) {
        _transformedData.id = routeData._id;
        _transformedData.url = '/api/routes/' + routeData._id;
    }
    if (routeData.owner_id) {
        _transformedData.ownerId = routeData.owner_id;
        _transformedData.ownerUrl = '/api/users/' + routeData.owner_id;
    }
    if (routeData.created_at) _transformedData.createdAt = routeData.created_at;
    return _transformedData;
}

function routeAPItoDB(routeData) {
    var _transformedData = {};
    if (routeData.id) _transformedData._id = routeData.id;
    if (routeData.ownerId) _transformedData.owner_id = routeData.ownerId;
    if (routeData.name) _transformedData.name = routeData.name;
    if (routeData.pois) _transformedData.pois = routeData.pois;
    return _transformedData;
}

module.exports = {
    userDBtoAPI: userDBtoAPI,
    userAPItoDB: userAPItoDB,
    poiDBtoAPI: poiDBtoAPI,
    poiAPItoDB: poiAPItoDB,
    routeAPItoDB: routeAPItoDB,
    routeDBtoAPI: routeDBtoAPI
}
