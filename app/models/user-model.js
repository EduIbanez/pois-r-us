var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema  = new mongoose.Schema({
    'email'      : { type : String, required  : true, unique: true },
    'first_name' : { type : String, required  : true },
    'last_name'  : { type : String, required  : true },
    'password'   : { type : String, required  : true },
    'is_admin'   : { type : Boolean, required : true, default : false },
    'created_at' : { type : Date, required    : true, default : Date.now() }
});

// Hash passwords before saving
userSchema.pre('save', function(callback) {
    var self = this;  //Keep reference to 'this' through callbacks
    if (self.isModified('password')) {
        bcrypt.genSalt(5, function(err, salt) {
            bcrypt.hash(self.password, salt, null, function(err, hash) {
                if (err) callback(err);
                else {
                    self.password = hash;
                    callback();
                }
            });
        });
    } else callback();
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
                    else callback(null, user);
                });
        });
}

module.exports = mongoose.model('User', userSchema);