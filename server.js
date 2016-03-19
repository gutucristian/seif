// spawn pyrelic library
// var spawn = require("child_process").spawn;
// var process = spawn('python',["test.py", "add", 2, 3]);

// process.stdout.on('data', function (data) {
//     console.log('from python script: ' + data);    
// });

// WIRING
// ===============================================================

// call packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://naitsirc:samsung@ds019839.mlab.com:19839/ttbear');
var Bear = require('../seif/models/bear');
const chalk = require('chalk');
const error = chalk.red;
const info = chalk.yellow;
const uniqueInfo = chalk.blue;

// configure app to use bodyParser()
// this will let us get the data from POST request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// ===============================================================

var router = express.Router(); // get instance of express Router

router.use(function (req, res, next) {
    console.log(info('Something is happening.'));
    next(); // make sure to go to next routes and don't stop here
});

// test route
router.get('/', function(req, res){
    res.json({ message: 'Welcome to API!' });
})

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
console.log(uniqueInfo('server running on port: ' + port));