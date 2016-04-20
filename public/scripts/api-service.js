var app = angular.module('PoisRUs');

app.service('ApiService', function($resource, BaseRoutes, ApiRoutes) {

    /* PRIVATE STUFF */

    var greeting = $resource(BaseRoutes.apiRoot + ApiRoutes.GREETING);

    function getGreeting() {
        return greeting.get.apply(greeting, arguments);
    }

    /* PUBLIC INTERFACE */

    return {
        getGreeting: getGreeting
    }
});
