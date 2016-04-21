var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var GroupSchema = new Schema({
    groupname: { type: String, unique: true},
    groupowner: String,
    groupmembers: Array,
    grouptags: [String]
});

module.exports = mongoose.model('Group', GroupSchema);