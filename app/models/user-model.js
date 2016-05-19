var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema  = new mongoose.Schema({
    'email'       : { type: String, required: true, unique: true },
    'first_name'  : { type: String, required: true },
    'last_name'   : { type: String, required: true },
    'password'    : { type: String, required: true },
    'created_at'  : { type: Date, required: true, default: Date.now },
    'last_access' : { type: Date, default: Date.now },
    'is_admin'    : { type: Boolean },
    'favourites'  : { type: [ObjectId], default: [] },
    'followees'   : { type: [ObjectId], default: [] }
});

// Save the original object when retrieved from the database. This is useful
// when comparing previous values with new values
userSchema.post('init', function() {
    this._original = this.toObject();
});

// Normalize email before saving
userSchema.pre('save', function(next) {
    this.email = this.email.toLowerCase();
    next();
});

// Hash password before saving
userSchema.pre('save', function(next) {
    var self = this;  //Keep reference to 'this' through nexts
    if (self.isModified('password')) {
        bcrypt.genSalt(5, function(err, salt) {
            bcrypt.hash(self.password, salt, null, function(err, hash) {
                if (err) next(err);
                else {
                    self.password = hash;
                    next();
                }
            });
        });
    } else next();
});

// Ensure followees are existing users
userSchema.pre('save', function(next) {
    var self = this;  //Keep reference to 'this' through callbacks
    if (self.isModified('followees')
            && self.followees.length >= self._original.followees.length) {
        var updatedFollowees = self.followees.filter(function(item) {
            self._original.followees.indexOf(item) == -1;
        });
        var promises = [];
        for (var i = 0; i < updatedFollowees.length; i++) {
            promises.push(this.count({_id: updatedFollowees[i]}));
        }
        Promise.all(promises).then(function(values) {
            if (values.indexOf(0) == -1) next(); // If there is no key with 0 appearances
            else next(new ValidationError('Followees must be existing users'));
        });
    } else next();
});

// Method to validate the password of a user asynchronously
userSchema.methods.validatePassword = function(password, callback) {
    if (this.password) bcrypt.compare(password, this.password, callback);
    else callback('User data does not contain any password field');
}

// Method to validate the credentials of a user
userSchema.statics.validateCredentials = function(email, password, callback) {
    return this.findOne({ email: email },
                        function(err, user) {
        if (err) callback(err); // MongoDB error
        else if (!user) callback(null, null);  //User not found
        else user.validatePassword(password, function(err, match) {
            if (err) callback(err); // Internal error
            else if (!match) callback(null, null);
            else {
                user.last_access = Date.now();
                return user.save(callback);
            }
        });
    });
}

module.exports = mongoose.model('User', userSchema);
