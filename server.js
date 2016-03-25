var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');
    
mongoose.connect('mongodb://naitsirc:samsung@ds019839.mlab.com:19839/ttbear');

var msk = "seif master secret key";

var WebServerSchema = require('../seif/models/webServer');
var UserSchema = require('../seif/models/user');

var WebServer = mongoose.model('WebServer', WebServerSchema);
var User = mongoose.model('User', UserSchema);

var spawn = require("child_process").spawn;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

function randomStr(){
    var text = '';
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for(var i=0; i < 5; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));        
    }        

    return text;
}

function createServer(serverId){
    var webServer = new WebServer();            
    
    webServer.webServerId = serverId; // w
    webServer.ensemblePrekey = randomStr(); // K[W]                
        
    webServer.save(function(err) {
        if(err){res.send(err);} 
    });   
    
    return webServer;               
}

router.post('/init', function(req, res) {       
    
    var w = req.body.webServerId; // server id                       
            
    WebServer.findOne({webServerId: w}, function(err, server){
        if(server == null){
            createServer(w);        
            console.log('created server (id: ' + w + ')');                              
            res.json({message: 'created server (id: ' + w + ')'});                             
        } else {
            console.log('ERROR: server exists (id: ' + w + ')');
            res.json({message: 'ERROR: server exists (id: ' + w + ')'});
        }     
    });        
        
});

router.post('/eval', function(req, res) {
    
    var w = req.body.webServerId; // server id
    var t = req.body.userId; // user id
    var x = req.body.blindedPassword; // blinded user password    
    
    WebServer.findOne({webServerId: w}, function(err, server){
       if(server == null){
            console.log('ERROR: no server associated with id \"' + w + '\"')
            res.json({message: 'ERROR: no server associated with id \"' + w + '\"'});
       } else {            
            var process = spawn('python',["pyrelic/vpop.py", "eval", w, t, x, msk, server.ensemblePrekey]);           
           
            process.stdout.on('data', function (data) {
                console.log('' + data);
                res.json({message: '' + data});    
            });                          
       }
    });
});

app.use('/seif', router);

app.listen(port);
console.log('server running on port ' + port);

// function createUser(userId, serverId, password) {
//     var user = new User();
            
//     user.userId = userId;
//     user.webServerId = serverId;                            
    
//     user.save(function(err) {
//         if(err){res.send(err);} 
//     });
    
//     return user;
// }

// router.post('/user', function(req, res){                   
        
//     var w = req.body.webServerId; // server id
//     var t = req.body.userId; // user id
//     var x = req.body.blindedPassword; // user password        
    
//     WebServer.findOne({webServerId: w}, function(err, server){
        
//         if(server == null){
//             console.log('ERROR: no server associated with id \"' + w + '\"')
//             res.json({message: 'ERROR: no server associated with id \"' + w + '\"'});    
//         } else {
            
//             User.findOne({userId: t, webServerId: w}, function(err, user){
//                 if(user == null){
//                     createUser(t, w, x);
//                     console.log('created user (id: ' + t + ') in server \"' + w + '\"');
//                     res.json({message: 'created user (id: ' + t + ') in server \"' + w + '\"'});                    
//                 } else {
//                     console.log('ERROR: user exists (id:' + t + ') in server \"' + w + '\"');
//                     res.json({message: 'ERROR: user exists (id:' + t + ') in server \"' + w + '\"'});
//                 }
//             });     
                                 
//         }
        
//     }); 
      
// });