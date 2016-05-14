var mongoose = require('mongoose');

var Schema   = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var poiSchema  = new Schema({
    'owner_id'        : { type: ObjectId, required: true },
    'name'            : { type: String, required: true },
    'description'     : { type: String, required: true },
    'file_uri'        : { type: String },
    'avg_punctuation' : { type: Number, required: true, default: 0 },
    'number_of_votes' : { type: Number, required: true, default: 0 },
    'created_at'  : { type : Date, required    : true, default : Date.now() },
    'coordinates' : {
        'lat': { type: Number, required: true },
        'lon': { type: Number, required: true }
    }
});

// Method to add a new vote to the POI
poiSchema.methods.addRating = function(score, callback) {
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

module.exports = mongoose.model('POI', poiSchema);
