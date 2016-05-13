var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');

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
        bcrypt.hash(self.password, 5, function(err, hash) {
            if (err) callback(err);
            else {
                self.password = hash;
                callback();
            }
        });
    } else callback();
});

// Method to validate the password of a user asynchronously
userSchema.methods.validatePassword = function(password, callback) {
    bcrypt.compare(password, this.password, callback);
}

module.exports = mongoose.model('User', userSchema);
