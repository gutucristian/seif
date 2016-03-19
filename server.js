// spawn pyrelic library
// var spawn = require("child_process").spawn;
// var process = spawn('python',["test.py", "add", 2, 3]);

// process.stdout.on('data', function (data) {
//     console.log('from python script: ' + data);    
// });


// test commit
// call packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from POST request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8080;

var router = express.Router();

router.post('/init', function(req, res){
    res.json({ message: 'ok' });
})



app.use('/api', router);

app.listen(port);
console.log('server running on port: ' + port);