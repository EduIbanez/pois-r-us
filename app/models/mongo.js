var mongoose = require("mongoose");

// create instance of Schema
var mongoSchema = mongoose.Schema;

// create schema
var userSchema  = {
    "userEmail" : String,
    "userPassword" : String
};

var poiSchema = new mongoSchema({
    "name" : String,
    "description" : String,
    "file" : { data: Buffer, contentType: String }
});

// create model if not exists.
module.exports = mongoose.model('users', userSchema);
module.exports = mongoose.model('pois', poiSchema);
