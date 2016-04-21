var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema = new Schema({
    username: { type: String, unique: true},
    password: String,
    gmail: String,
    interests: [String],
    groupsOwn: Array,	// Groups created by this user
    groupsJoin: Array,
    groupsIn: Array
});

module.exports = mongoose.model('User', UserSchema);