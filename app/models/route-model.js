var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var routeSchema  = new mongoose.Schema({
    'name' : { type: String, required: true },
    'pois' : { type: [ObjectId], required: true },
    'owner_id'   : { type: String, required: true },
    'created_at' : { type: Date, required: true, default: Date.now },
    'avg_punctuation' : { type: Date, required: true, default: 0 },
    'number_of_votes' : { type: Date, required: true, default: 0 },
});

// Method to add a new vote to the route
routeSchema.methods.addRating = function(score, callback) {
    if(score > 5 || score < 1 || score % 1 !== 0) {
        // FIXME: This callback should receive an Error or a RangeError, not a string. It receives a string because otherwise it will not be displayed on the response.
        callback('Score must have integer values between 1 and 5');
    } else {
        var _avg = this.avg_punctuation;
        var _num = this.number_of_votes;
        this.avg_punctuation =
            (_num * _avg / (_num + 1)) + (score / (_num + 1));
        this.number_of_votes ++;
        this.save(callback);
    }
}

module.exports = mongoose.model('Route', routeSchema);
