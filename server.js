// spawn pyrelic library
// var spawn = require("child_process").spawn;
// var process = spawn('python',["test.py", "add", 2, 3]);

// process.stdout.on('data', function (data) {
//     console.log('from python script: ' + data);    
// });

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');
    
mongoose.connect('mongodb://naitsirc:samsung@ds019839.mlab.com:19839/ttbear');

var WebServerSchema = require('../seif/models/webServer');
var UserSchema = require('../seif/models/user');

var WebServer = mongoose.model('WebServer', WebServerSchema);
var User = mongoose.model('User', UserSchema);

// configure app to use bodyParser()
// this will let us get the data from POST request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router(); // get instance of express Router

router.use(function (req, res, next) {
    console.log('Something is happening.');
    next(); // make sure to go to next routes and don't stop here
});

router.get('/', function(req, res) {
    res.json({message: "Hi"});
});

router.post('/init', function(req, res) {
    var w = req.body.webServerId;
    var t = req.body.userId;
    var x = req.body.blindedPassword;
    
    console.log('w: ' + w);
    console.log('t: ' + t);
    console.log('x: ' + x);
    
    WebServer.findOne({webServerId: w}, function(err, server){
        if(err){res.send(err);}
        
        if(server == null){            
            var webServer = new WebServer();
            webServer.webServerId = w;
                
            webServer.save(function(err) {
                if(err){res.send(err);} 
            });
            console.log('created server with id: ' + w);
        } else {
            console.log('server with id ' + w + ' exists')
        }
                              
    });          

    UserSchema.findOne({userId: t}, function(err, user){
        if(err){res.send(err);}
        
        if(user == null){
            var user = new User();
            user.userId = t;
            user.webServerId = w;
            
            user.save(function(err) {
                if(err){res.send(err);} 
            }); 
            console.log('created user with id: ' + t);
        } else {
            console.log('user with id ' + t + ' exists')
        }
    });
    
    var servers;
    var users;
    
    res.json({message});
});

router.get('/eval', function(req, res) {   
    var w = req.body.webServerId;
    var t = req.body.userId;
    var x = req.body.blindedPassword;
    
    res.json();
});

// routes that end in /bears
router.route('/bears')

    // create bear
    .post(function(req, res){        
        var bear = new Bear(); // create new instance of the Bear model
        bear.name = req.body.name; // set the bears name
        
        bear.save(function(err){
            if(err){
                res.send(err);
            }else {
                res.json({message: 'bear ' + bear.name + ' created'});
            }
        });             
    })

    // get all the bears
    .get(function(req, res){
        Bear.find(function(err, bears){
        if(err){
            res.send(err);
        }else{
            res.json(bears);
        }
        });
    });

router.route('/bears/:bear_id')

    // get bear with this bear_id
    .get(function(req, res) {    
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err) {
                res.send(err);            
            }else{
                res.json(bear);
            }
        })
    })

    // update bear name of bear with bear_id
    .put(function(req, res){
        Bear.findById(req.params.bear_id, function(err, bear){
            if (err) {
                res.send(err);            
            }else{            
                bear.name = req.body.name;
                
                bear.save(function(err){
                    if(err){
                        res.send(err);
                    }else{
                        res.json({message: 'bear updated'});
                    }
                });
            }
        });                
    })

    .delete(function(req, res){
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear){
            if(err){
                res.send(err)
            }else{
                res.json({message: 'bear successfully deleted'});
            }
        });
    });

// REGISTER OUR ROOTS
// all of our routes will be prefixed with /api
app.use('/api', router);

// START SERVER
// ===============================================================
app.listen(port);
console.log('server running on port: ' + port);