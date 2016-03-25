var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');
    
mongoose.connect('mongodb://naitsirc:samsung@ds019839.mlab.com:19839/ttbear');

var WebServerSchema = require('../seif/models/webServer');
var UserSchema = require('../seif/models/user');

var WebServer = mongoose.model('WebServer', WebServerSchema);
var User = mongoose.model('User', UserSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.post('/init', function(req, res) {
    
    var w = req.body.webServerId; // server id   
    
    console.log('Request: create server with id "' + w + '"');    
    
    WebServer.findOne({webServerId: w}, function(err, server){
        if(err){res.send(err);}
        
        if(server == null){            
            var webServer = new WebServer();
            webServer.webServerId = w;
                
            webServer.save(function(err) {
                if(err){res.send(err);} 
            });           
            
            console.log('   > created server with id "' + w + '"');
            res.json({message: 'created server with id "' + w + '"'});
        } else {
            console.log('   > server with id "' + w + '" exists');
            res.json({message: 'server with id "' + w + '" exists'});
        }
                              
    });          
        
});

router.post('/user', function(req, res){                   
        
    var w = req.body.webServerId; // server id
    var t = req.body.userId; // user id
    var x = req.body.blindedPassword; // user password
    
    console.log('Request: create user with id "' + t + '" for server "' + w + '"');
    
    User.findOne({userId: t, webServerId: w}, function(err, user){
        
        if(err){res.send(err);}
        
        if(user == null){
            var user = new User();
            
            user.webServerId = w;
            user.userId = t;                        
            
            user.save(function(err) {
                if(err){res.send(err);} 
            }); 
            
            console.log('   > created user with id "' + t + '" for server "' + w + '"');
            res.json({message: 'created user with id "' + t + '" for server "' + w + '"'});
        } else {                
            console.log('   > user with id "' + t + '" in server "' + w + '" exists');  
            res.json({message: 'user with id "' + t + '" in server "' + w + '" exists'});                        
        }
        
    });  
      
});

app.use('/seif', router);

app.listen(port);
console.log('server running on port ' + port);