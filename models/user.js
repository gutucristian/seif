var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userId: String,
    webServerId: String
});

module.exports = mongoose.model('User', userSchema);