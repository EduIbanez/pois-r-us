var mongoose = require("mongoose");

// create instance of Schema
var mongoSchema = mongoose.Schema;

// create schema
var userSchema  = {
    "email" : String,
    "password" : String,
    "role" : String
};

var poiSchema = new mongoSchema({
    "name" : String,
    "description" : String,
    "punctuation" : Number,
    "number_votes" : Number,
    "file" : { data: Buffer, contentType: String },
    "id_user" : ObjectId
});

// create model if not exists.
module.exports = mongoose.model('users', userSchema);
module.exports = mongoose.model('pois', poiSchema);
