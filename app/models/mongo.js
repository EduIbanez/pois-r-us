var mongoose = require("mongoose");

// create instance of Schema
var mongoSchema = mongoose.Schema;

// create schema
var userSchema  = new mongoSchema({
    "email" : String,
    "password" : String,
    "role" : String,
    "created_at": { type: Date, required: true, default: Date.now() }
});

var poiSchema = new mongoSchema({
    "name" : String,
    "description" : String,
    "coordinates" : [Number, Number],
    "punctuation" : Number,
    "number_votes" : Number,
    "file" : String,
    "id_user" : mongoSchema.Types.ObjectId
});

// create model if not exists.
module.exports = mongoose.model('users', userSchema);
module.exports = mongoose.model('pois', poiSchema);
