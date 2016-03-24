var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WebServerSchema = new Schema({
    webServerId: String,
    secret: String    
});

module.exports = mongoose.model('WebServer', WebServerSchema);