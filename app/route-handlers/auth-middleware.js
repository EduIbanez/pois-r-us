var UserModel = require('../models/user-model');

/*
 * BASIC HTTP AUTHENTICATION INTERCEPTION MIDDLEWARE:
 *
 * This function intercepts the Authorization header on an http request,
 * checks if it contains accurate data and adds an object to the request called
 * 'auth', which contains the authorization information for the request.
 * If the auth data is valid according to Basic http authorization protocol,
 * it adds to the object auth the database id, first name, last name and email
 * of the authenticated user. If the provided auth info is not correct, it will
 * add to the request object the object auth.
 */
var basicHttpAuthInterceptor = function(req, res, next) {
    var _authHeader = (req.get('Authorization') || '').split(' ');
    var _authMethod = _authHeader[0];
    if (_authMethod === 'Basic') {
        var _authToken   = new Buffer(_authHeader[1], 'base64').toString();
        var _credentials = _authToken.split(':');
        UserModel.validateCredentials(_credentials[0],
                                      _credentials[1],
                                      function(err, data) {
            if (err) throw err;
            else if (data) {
                req.auth = {
                    id: data._id,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    email: data.email,
                    isAdmin: data.is_admin
                };
                next();
            } else {
                req.auth = { error: 'WRONG_CREDENTIALS' };
                next();
            }
        });
    } else if (_authMethod) {
        req.auth = { error: 'WRONG_AUTH_METHOD' };
        next();
    } else {
        req.auth = { error: 'AUTH_NOT_FOUND' };
        next();
    }
};

/*
 * AUTHENTICATED ONLY RESTRICTION MIDDLEWARE:
 *
 * This function is a middleware for express that enforces the user to be
 * authenticated on a certain endpoint. It checks if the request contains the
 * field auth and if it contains any errors. If everything is correct it does
 * nothing; otherwise it will return to the user a 401 error with some feedback
 */
var restrictToAuthenticated = function(req, res, next) {
    // XXX: Not sending WWW-Authenticate header for preventing the browser to display login popup.
    if (!req.auth || req.auth.error === 'AUTH_NOT_FOUND') {
        // res.set('WWW-Authenticate', 'Basic realm="PoisRUs"');
        res.status(401).json({ error: 'No auth information was found' });
    } else if (req.auth.error === 'WRONG_AUTH_METHOD') {
        // res.set('WWW-Authenticate', 'Basic realm="PoisRUs"');
        res.status(401).json({ error: 'Wrong auth method' });
    } else if (req.auth.error === 'WRONG_CREDENTIALS') {
        // res.set('WWW-Authenticate', 'Basic realm="PoisRUs"');
        res.status(401).json({ error: 'Authentication failed' });
    } else next();
};

module.exports = {
    basicHttp: basicHttpAuthInterceptor,
    authRestriction: restrictToAuthenticated,
}
