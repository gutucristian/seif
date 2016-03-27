var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WebServerSchema = new Schema({
    serverId: String,
    ensemblePrekey: String,
    ensembleKey: String    
});

module.exports = mongoose.model('WebServer', WebServerSchema);