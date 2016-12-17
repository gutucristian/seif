var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),    
    msk = 'seif master secret key',  
    MongoClient = require('mongodb').MongoClient,  
    url = 'mongodb://localhost:27017/seif';    
    spawn = require("child_process").spawn,
    port = process.env.PORT || 8080,
    assert = require('assert');        

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function randomStr(){
    var text = '';
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for(var i=0; i < 5; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));        
    }        

    return text;
}

MongoClient.connect(url, function(err, db){    
    assert.equal(err, null);
    console.log('connected to mongodb')        
    
    app.post('/init', function(req, res){
        
        var clientId = req.body.serverId;
        console.log('clientId: ' + clientId)
        
        // find client in db
        db.collection('clients').findOne({'clientId': clientId}, function(err, client){

            // if client does not exist in db create one else throw error
            if(client){
            
                res.json({'message': 'server already initiated'});
                
            }else{
                
                var ensemblePrekey = randomStr();
                        
                console.log('ensemblePrekey: ' + ensemblePrekey);
                db.collection('clients').insertOne({'clientId': clientId, 'ensemblePrekey': ensemblePrekey});
                
                res.json({'message': 'server initiated'});

            }
                        
        });
                                                                                
    });
        
    app.post('/eval', function(req, res){
        var clientId = req.body.serverId;
        var username = req.body.username;
        var blindedPassword = req.body.blindedPassword;
        
        console.log('clientId (w): ' + clientId);
        console.log('username (t): ' + username);
        console.log('blindedPassword (x): ' + blindedPassword);
        
        db.collection('clients').findOne({'clientId': clientId}, function (err, client) {
            
            if(client){
                                
                console.log('client ensemblePrekey (k): ' + client.ensemblePrekey);
            
                var process = spawn('python',["pyrelic/vpop.py", "eval", clientId, username, blindedPassword, msk, client.ensemblePrekey]);
                         
                process.stdout.on('data', function (data) {
                    //data = data + '';
                    //console.log(data);
                    //var i = data.indexOf('|');
                    //var hardenedPas = data.substring(i+1) + '';
                    console.log('y: ' + data)
                    var y = data + '';                
                    res.json({'y': y})                                       
                }); 
                
            }else{
                
                res.json({'message': 'invalid serverId'});
                
            }
                                                            
        });                
                
    });
    
    app.listen(port);
    console.log('server running on port ' + port);
})

// var process = spawn('python',["pyrelic/vpop.py", "eval", w, t, x, msk, server.ensemblePrekey]);           
           
// process.stdout.on('data', function (data) {
//     console.log('' + data);
//     res.json({message: '' + data});    
// });  