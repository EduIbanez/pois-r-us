var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var routeSchema  = new mongoose.Schema({
    'name' : { type: String, required: true },
    'pois' : { type: [ObjectId], required: true },
    'owner_id'   : { type: String, required: true },
    'created_at' : { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Route', routeSchema);
