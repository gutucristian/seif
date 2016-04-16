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
            
                var process = spawn('python',["pyrelic/prf.py", "genKw", clientId, msk, ensemblePrekey]);        
                
                process.stdout.on('data', function (data) {            
                    // NOTE: I save ensembleKey as a string not a BigInt  
                    ensembleKey = data + '';
                    
                    console.log('ensemblePrekey: ' + ensemblePrekey);
                    console.log('ensembleKey: ' + ensembleKey);
                    
                    db.collection('clients').insertOne({'clientId': clientId, 'ensemblePrekey': ensemblePrekey, 'ensembleKey': ensembleKey});
                    
                    res.json({'message': 'ok'});                          
                });
                                  
            }
                        
        });
                                                                                
    });
        
    app.post('/eval', function(req, res){
        
    });
    
    app.listen(port);
    console.log('server running on port ' + port);
})

// var process = spawn('python',["pyrelic/vpop.py", "eval", w, t, x, msk, server.ensemblePrekey]);           
           
// process.stdout.on('data', function (data) {
//     console.log('' + data);
//     res.json({message: '' + data});    
// });  